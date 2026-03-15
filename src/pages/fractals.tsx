import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Fractals() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    // Three different colors: one for the inside of the set, one for the outside, and one in-between.
    // Interpolation is done between the two last colors
    const [shadeStart, setShadeStart] = useState('#F66151');
    const [shadeEnd, setShadeEnd] = useState('#241F31');
    const [setColor, setSetColor] = useState('#000000');
    
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
    
    const [realFunction, setRealFunction] = useState('zr*zr - zi*zi + cr');
    const [functionError, setFunctionError] = useState('');
    
    const [imagFunction, setImagFunction] = useState('abs(2*zr*zi) + ci');

    const [fractalConfig, setFractalConfig] = useSearchParams();
    
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
        const gl = canvas.getContext('webgl', {preserveDrawingBuffer: true}) || canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
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
        const realExpr = toGLSL(realFunction);
        const imagExpr = toGLSL(imagFunction);

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
        const rgbSet = hexToRGB(setColor);

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
        uniform vec3 u_color_start;
        uniform vec3 u_color_end;

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
                gl_FragColor = vec4(${rgbSet[0]}, ${rgbSet[1]}, ${rgbSet[2]}, 1.0);
            } else {
                float t = float(iter) / float(u_maxIter);
                vec3 col = u_color_end + t * (u_color_start - u_color_end);
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
        } catch (e) {
            setFunctionError('Error in shader: ' + e.message);
            return;
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
            // When the fractal has the maximum iteration value, it should be shadeStart. If it has the minimum iteration value (1), it should be shadeEnd. So we want to interpolate from shadeEnd to shadeStart as iteration goes from 1 to maxIterations. This means the base color (when t=0) is shadeEnd, and we add (shadeStart - shadeEnd) * t to it.
            const u_color_start = gl.getUniformLocation(program, 'u_color_start');
            const u_color_end = gl.getUniformLocation(program, 'u_color_end');

            gl.uniform2f(u_resolution, width, height);
            gl.uniform1f(u_xMin, xMin);
            gl.uniform1f(u_xMax, xMax);
            gl.uniform1f(u_yMin, yMin);
            gl.uniform1f(u_yMax, yMax);
            gl.uniform1i(u_maxIter, Math.min(maxIterations, 512));
            const rgbStart = hexToRGB(shadeStart);
            const rgbEnd = hexToRGB(shadeEnd);
            gl.uniform3f(u_color_start, rgbStart[0], rgbStart[1], rgbStart[2]);
            gl.uniform3f(u_color_end, rgbEnd[0], rgbEnd[1], rgbEnd[2]);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            // Done with WebGL rendering - skip 2D putImageData
            setLoading(false);

            return;
        }
    };

    // Debounced URL sync — updates query params 500ms after the last state change
    // This avoids crashing the browser when the states are updated too frequently, because the URL cannot update infinitely fast in most browsers. 
    // It also allows users to change multiple parameters (e.g. pan and zoom) without filling their URL history with intermediate states.
    useEffect(() => {
        const timer = setTimeout(() => {
            setFractalConfig({
                xMin: viewPosition.xMin,
                xMax: viewPosition.xMax,
                yMin: viewPosition.yMin,
                yMax: viewPosition.yMax,
                maxIterations,
                resolution,
                shadeStart,
                shadeEnd,
                setColor,
                realFunction,
                imagFunction
            }, { replace: true });
        }, 500);
        return () => clearTimeout(timer);
    }, [viewPosition, maxIterations, resolution, realFunction, imagFunction, shadeStart, shadeEnd, setColor]);

    // Set parameters from URL on initial load
    useEffect(() => {
        const config = {
            xMin: parseFloat(fractalConfig.get('xMin')) || -2,
            xMax: parseFloat(fractalConfig.get('xMax')) || 1,
            yMin: parseFloat(fractalConfig.get('yMin')) || -1.5,
            yMax: parseFloat(fractalConfig.get('yMax')) || 1.5,
            maxIterations: parseInt(fractalConfig.get('maxIterations')) || 32,
            resolution: parseInt(fractalConfig.get('resolution')) || 500,
            shadeStart: fractalConfig.get('shadeStart') || '#F66151',
            shadeEnd: fractalConfig.get('shadeEnd') || '#241F31',
            setColor: fractalConfig.get('setColor') || '#000000',
            realFunction: fractalConfig.get('realFunction') || 'zr*zr - zi*zi + cr',
            imagFunction: fractalConfig.get('imagFunction') || 'abs(2*zr*zi) + ci'
        };
        setViewPosition({
            xMin: config.xMin,
            xMax: config.xMax,
            yMin: config.yMin,
            yMax: config.yMax
        });
        setMaxIterations(config.maxIterations);
        setResolution(config.resolution);
        setShadeStart(config.shadeStart);
        setShadeEnd(config.shadeEnd);
        setSetColor(config.setColor);
        setRealFunction(config.realFunction);
        setImagFunction(config.imagFunction);
    }, []);

    // Initial render
    useEffect(() => {
        renderFractal();
    }, [viewPosition, maxIterations, resolution, realFunction, imagFunction, shadeStart, shadeEnd, setColor]);


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

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // Render a temporary "copied!" message for 1 second
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
    };

    return (
        <div className="fractal-container">
            <h1>Fractal explorer</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="fractal-controls" style={{ flex: '0 0 40%', marginRight: '20px', fontSize: '1.5em' }}>
                    <h2>Controls</h2>
                    <label htmlFor="resolution">Resolution: {resolution}x{resolution}</label><br/>
                    <input type="range" id="resolution" name="resolution" min="100" max="3000" step="50" style={{width: "100%"}} value={resolution} onChange={(e) => setResolution(parseInt(e.target.value))}/>
                    <br/>
                    <label htmlFor="iterations">Number of colors: {maxIterations}</label><br/>
                    <input type="range" id="iterations" name="iterations" min="1" max="512" style={{width: "100%"}} value={maxIterations} onChange={(e) => setMaxIterations(parseInt(e.target.value))}/>
                    <br/>
                    <label htmlFor="realFunction">z<sub>i+1</sub>= </label>
                    <input 
                        type="text" 
                        id="realFunction" 
                        value={realFunction}
                        onChange={(e) => {
                            setRealFunction(e.target.value);
                            setFunctionError('');
                        }}
                        placeholder="e.g., zr^2 - zi^2 + cr"
                        style={{ width: '40%', marginBottom: '10px', fontSize: '1em' }}
                    />
                    <label htmlFor="imagFunction"> + i</label>
                    <input 
                        type="text" 
                        id="imagFunction" 
                        value={imagFunction}
                        onChange={(e) => {
                            setImagFunction(e.target.value);
                            setFunctionError('');
                        }}
                        placeholder="e.g., abs(2*zr*zi) + ci"
                        style={{ width: '40%', marginBottom: '10px', fontSize: '1em' }}
                        />
                    <br/>
                    {functionError && <p style={{ color: 'red' }}>{functionError}</p>}
                    <label htmlFor="shadeStart">Shade: </label>
                    <input type="color" id="shadeStart" name="shadeStart" value={shadeStart} onChange={(e) => {setShadeStart(e.target.value);}}/>
                    
                    <span style={{ margin: '0 1em' }}></span>
                    
                    <label htmlFor="shadeEnd"> Outer color: </label>
                    <input type="color" id="shadeEnd" name="shadeEnd" value={shadeEnd} onChange={(e) => {setShadeEnd(e.target.value);}}/>
                    
                    <span style={{ margin: '0 1em' }}></span>
                    
                    <label htmlFor="setColor">Inner color: </label>
                    <input type="color" id="setColor" name="setColor" value={setColor} onChange={(e) => {setSetColor(e.target.value);}}/>
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
                    <button onClick={copyLink} style={{ marginTop: '10px', padding: '3px 10px', fontSize: '1em' }}>Share this fractal 🔗</button>
                    {copySuccess && <span style={{ marginLeft: '10px', color: 'white' }}>✓ Link copied</span>}
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