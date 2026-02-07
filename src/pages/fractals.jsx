import { useState, useEffect, useRef } from 'react';

export default function Fractals() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    
    const [shade, setShade] = useState('#62A0EA');
    const [maxIterations, setMaxIterations] = useState(32);
    const [resolution, setResolution] = useState(500);
    // Add state for managing view position
    const [viewPosition, setViewPosition] = useState({
        xMin: -2, xMax: 1,
        yMin: -1.5, yMax: 1.5
    });

    // Track mouse state for panning
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
    
    const [customRealFunction, setCustomRealFunction] = useState('zr*zr - zi*zi + cr');
    const [functionError, setFunctionError] = useState('');
    
    const [customImagFunction, setCustomImagFunction] = useState('abs(2*zr*zi) + ci');

    // Function to render the fractal with current view position
    const renderFractal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        // Fractal parameters
        const { xMin, xMax, yMin, yMax } = viewPosition;

        setLoading(true);
        
        // Try to use WebGL for acceleration
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hexToRGB = (h) => {
            const r = parseInt(h.slice(1,3),16)/255;
            const g = parseInt(h.slice(3,5),16)/255;
            const b = parseInt(h.slice(5,7),16)/255;
            return [r,g,b];
        };

        if (!gl) {
            setFunctionError('WebGL not supported :(');
            return;
        }

        // Convert JS user expressions to GLSL-ish expressions
        const toGLSL = (expr) => {
            if (!expr) return '0.0';
            
            // Convert integer literals to float literals (e.g. 2 -> 2.0) so GLSL doesn't try to mix int*float
            // Note: this targets standalone integer tokens and avoids touching things like property names.
            let s = expr.replace(/(\b\d+)(?!\.)\b/g, '$1.0');
            
            // Replace power operator a ^ b with pow(a,b) (simple heuristic)
            s = s.replace(/([0-9A-Za-z_\)\.\]\}]+)\s*\^\s*([0-9A-Za-z_\(\.\[\{]+)/g, 'pow($1,$2)');

            return s;
        };
        const realExpr = toGLSL(customRealFunction);
        const imagExpr = toGLSL(customImagFunction);

        // Basic passthrough vertex shader
        const vsSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            // map from [-1,1] -> [0,1], then flip Y to match canvas coord system
            v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
        `;

        // Fragment shader performs iterations in GPU
        const fsSource = `
        // Use high precision for better zoom levels
        precision highp float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_xMin;
        uniform float u_xMax;
        uniform float u_yMin;
        uniform float u_yMax;
        uniform int u_maxIter;
        uniform vec3 u_color;

        // user-provided expressions will use zr, zi, cr, ci
        float sqr(float x){ return x*x; }

        void main() {
            vec2 frag = v_uv * u_resolution;
            float x = frag.x;
            float y = frag.y;
            float cr = u_xMin + (x / u_resolution.x) * (u_xMax - u_xMin);
            float ci = u_yMin + (y / u_resolution.y) * (u_yMax - u_yMin);

            float zr = 0.0;
            float zi = 0.0;
            int iter = 0;
            // GLSL requires constant loop bound; set safely above typical max
            const int MAX_LOOP = 512;
            for (int i = 0; i < MAX_LOOP; i++) {
            if (i >= u_maxIter) break;

            // Injected user expressions (must use zr,zi,cr,ci and GLSL functions)
            float newZr = ${realExpr};
            float newZi = ${imagExpr};

            zr = newZr;
            zi = newZi;

            if (sqr(zr) + sqr(zi) > 4.0) {
                iter = i + 1;
                break;
            }
            // if we reach the max provided iter without escape, mark as inside
            if (i == u_maxIter - 1) {
                iter = u_maxIter;
            }
            }

            if (iter == u_maxIter) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
            float t = float(iter) / float(u_maxIter);
            vec3 col = u_color * t;
            gl_FragColor = vec4(col, 1.0);
            }
        }
        `;

        // Compile helpers
        const compile = (src, type) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            const err = gl.getShaderInfoLog(sh);
            gl.deleteShader(sh);
            throw new Error(err);
        }
            return sh;
        };

        let program;
        try {
            const vs = compile(vsSource, gl.VERTEX_SHADER);
            const fs = compile(fsSource, gl.FRAGMENT_SHADER);
            program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(program));
            }
        } catch (err) {
            // Fallback to CPU renderer on shader compile error
            console.warn('WebGL shader failed, falling back to CPU:', err.message);
        }

        if (program) {
            gl.viewport(0, 0, width, height);
            gl.clearColor(0,0,0,1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const posLoc = gl.getAttribLocation(program, 'a_position');
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            // full-screen triangle strip
            const verts = new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

            gl.useProgram(program);
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            // set uniforms
            const u_resolution = gl.getUniformLocation(program, 'u_resolution');
            const u_xMin = gl.getUniformLocation(program, 'u_xMin');
            const u_xMax = gl.getUniformLocation(program, 'u_xMax');
            const u_yMin = gl.getUniformLocation(program, 'u_yMin');
            const u_yMax = gl.getUniformLocation(program, 'u_yMax');
            const u_maxIter = gl.getUniformLocation(program, 'u_maxIter');
            const u_color = gl.getUniformLocation(program, 'u_color');

            gl.uniform2f(u_resolution, width, height);
            gl.uniform1f(u_xMin, xMin);
            gl.uniform1f(u_xMax, xMax);
            gl.uniform1f(u_yMin, yMin);
            gl.uniform1f(u_yMax, yMax);
            gl.uniform1i(u_maxIter, Math.min(maxIterations, 512));
            const rgb = hexToRGB(shade);
            gl.uniform3f(u_color, rgb[0], rgb[1], rgb[2]);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            // Done with WebGL rendering - skip 2D putImageData
            setLoading(false);
            return;
        }
    };

    // Initial render
    useEffect(() => {
        renderFractal();
    }, [viewPosition, maxIterations, resolution, customRealFunction, customImagFunction, shade]);


    // Handle mouse events for panning
    const handleMouseDown = (e) => {
        setIsPanning(true);
        setStartPanPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isPanning) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const width = canvas.width;
        const height = canvas.height;
        
        const dx = e.clientX - startPanPosition.x;
        const dy = e.clientY - startPanPosition.y;
        
        // Calculate how much to move in the complex plane
        const rangeX = viewPosition.xMax - viewPosition.xMin;
        const rangeY = viewPosition.yMax - viewPosition.yMin;
        
        const moveX = (dx / width) * rangeX;
        const moveY = (dy / height) * rangeY;
        
        // Update view position (move opposite to mouse direction)
        setViewPosition({
            xMin: viewPosition.xMin - moveX,
            xMax: viewPosition.xMax - moveX,
            yMin: viewPosition.yMin - moveY,
            yMax: viewPosition.yMax - moveY
        });
        
        // Update start position for next move
        setStartPanPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleMouseLeave = () => {
        setIsPanning(false);
    };

    // Handle mouse wheel for zooming
    const handleWheel = (e) => {
        e.preventDefault();
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Map mouse position to complex plane
        const width = canvas.width;
        const height = canvas.height;
        const zoomPoint = {
            x: viewPosition.xMin + (mouseX / width) * (viewPosition.xMax - viewPosition.xMin),
            y: viewPosition.yMin + (mouseY / height) * (viewPosition.yMax - viewPosition.yMin)
        };
        
        // Zoom factor (adjust as needed)
        const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
        
        // Calculate new ranges
        const newRangeX = (viewPosition.xMax - viewPosition.xMin) * zoomFactor;
        const newRangeY = (viewPosition.yMax - viewPosition.yMin) * zoomFactor;
        
        // Calculate new boundaries while keeping the mouse position fixed
        setViewPosition({
            xMin: zoomPoint.x - (mouseX / width) * newRangeX,
            xMax: zoomPoint.x + (1 - mouseX / width) * newRangeX,
            yMin: zoomPoint.y - (mouseY / height) * newRangeY,
            yMax: zoomPoint.y + (1 - mouseY / height) * newRangeY
        });
    };

    return (
        <div className="fractal-container">
            <h1>Fractal explorer</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="fractal-controls" style={{ flex: '0 0 40%', marginRight: '20px', fontSize: '1.5em' }}>
                    <h2>Controls</h2>
                    <label htmlFor="resolution">Resolution: {resolution}x{resolution}</label><br/>
                    <input type="range" id="resolution" name="resolution" min="100" max="1000" step="10" style={{width: "100%"}} defaultValue="500" onChange={(e) => setResolution(parseInt(e.target.value))}/>
                    <br/>
                    <label htmlFor="iterations">Number of colors: {maxIterations}</label><br/>
                    <input type="range" id="iterations" name="iterations" min="1" max="256" style={{width: "100%"}} defaultValue="32" onChange={(e) => setMaxIterations(parseInt(e.target.value))}/>
                    <br/>
                    <label htmlFor="customRealFunction">z<sub>i+1</sub>= </label>
                    <input 
                        type="text" 
                        id="customRealFunction" 
                        value={customRealFunction}
                        onChange={(e) => {
                            setCustomRealFunction(e.target.value);
                            setFunctionError('');
                        }}
                        placeholder="e.g., zr^2 - zi^2 + cr"
                        style={{ width: '40%', marginBottom: '10px', fontSize: '1em' }}
                    />
                    <label htmlFor="customImagFunction"> + i</label>
                    <input 
                        type="text" 
                        id="customImagFunction" 
                        value={customImagFunction}
                        onChange={(e) => {
                            setCustomImagFunction(e.target.value);
                            setFunctionError('');
                        }}
                        placeholder="e.g., abs(2*zr*zi) + ci"
                        style={{ width: '40%', marginBottom: '10px', fontSize: '1em' }}
                        />
                    <br/>
                    {functionError && <p style={{ color: 'red' }}>{functionError}</p>}
                    <label htmlFor="color">Color:</label>
                    <input type="color" id="color" name="color" value={shade} onChange={(e) => {setShade(e.target.value);}}/>
                    <p>Click and drag to pan, scroll to zoom</p>
                    {(() => {
                        const rangeX = viewPosition.xMax - viewPosition.xMin;
                        const rangeY = viewPosition.yMax - viewPosition.yMin;
                        const calcPrecision = (range) => {
                            // base of 4 significant digits (first non-zero + 3 digits), increase when zoomed in
                            const safeRange = Math.abs(range) > 0 ? Math.abs(range) : 1;
                            return Math.max(4, Math.ceil(-Math.log10(safeRange)) + 1);
                        };
                        const format = (v, range) => {
                            const p = calcPrecision(range);
                            try { return Number(v).toPrecision(p); } catch { return String(v); }
                        };
                        return (
                            <p>
                                Showing {format(viewPosition.xMin, rangeX)} + {format(viewPosition.yMin, rangeY)}i
                                {' '}to{' '}
                                {format(viewPosition.xMax, rangeX)} + {format(viewPosition.yMax, rangeY)}i
                            </p>
                        );
                    })()}
                </div>
                
                <div className="fractal-section" style={{ flex: 1 }}>
                    <h2>Viewer</h2>
                    {/* If the fractal is not rendering, it is probably because it is written incorrectly */}
                    {loading && <p>Invalid recusive function. Only zr, zi, cr, ci, GLSL syntax and ^ are allowed</p>}
                    <canvas 
                        ref={canvasRef} 
                        width={resolution} 
                        height={resolution}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onWheel={handleWheel}
                        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
                    />
                </div>
            </div>
        </div>
    );
}