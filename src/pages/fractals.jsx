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
    
    const [customRealFunction, setCustomRealFunction] = useState('z.real*z.real - z.imag*z.imag + c.real');
    const [functionError, setFunctionError] = useState('');
    
    const [customImagFunction, setCustomImagFunction] = useState('Math.abs(2*z.real*z.imag) + c.imag');

    // Function to render the fractal with current view position
    const renderFractal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const imageData = ctx.createImageData(width, height);

        // Fractal parameters
        const { xMin, xMax, yMin, yMax } = viewPosition;

        setLoading(true);
        
        // Function to map pixel coordinates to complex plane
        const mapToComplex = (x, y) => ({
            real: xMin + (x / width) * (xMax - xMin),
            imag: yMin + (y / height) * (yMax - yMin)
        });

        let fn = new Function();
        try {
            fn = new Function('z', 'c', `return {real: ${customRealFunction}, imag: ${customImagFunction}};`);
            // Try evaluating the function with dummy values to catch syntax errors early
            fn({ real: 0, imag: 0 }, { real: 0, imag: 0 });
        } catch (err) {
            setFunctionError(`Invalid function: ${err.message}`);
            return;
        }
        // Compute the Mandelbrot set
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const c = mapToComplex(x, y);
                let z = { real: 0, imag: 0 };
                let iter = 0;

                while (z.real * z.real + z.imag * z.imag <= 4 && iter < maxIterations) {
                    // Mandelbrot:
                    // z = z^2 + c until |z| > 2 or max iterations
                    // const real = z.real * z.real - z.imag * z.imag + c.real;
                    // const imag = 2 * z.real * z.imag + c.imag;
                    // Burning Ship:
                    // z = |Re(z)|^2 - |Im(z)|^2 + c
                    // In the while loop, replace the Mandelbrot/Burning Ship calculation with:

                    const result = fn(z, c);
                    z.real = result.real;
                    z.imag = result.imag;
                    iter++;
                }

                // Color based on iterations
                const idx = (y * width + x) * 4;
                if (iter === maxIterations) {
                    // Points in the set are black
                    imageData.data[idx] = 0;
                    imageData.data[idx + 1] = 0;
                    imageData.data[idx + 2] = 0;
                } else {
                    // TODO allow different color maps, currently just a gradient from black to red based on iterations
                    // Points outside are colored based on iteration count
                    const color = iter / maxIterations;
                    // Convert the hex color to RGB and apply the iteration-based intensity
                    const r = parseInt(color * (parseInt(shade.slice(1, 3), 16)));
                    const g = parseInt(color * (parseInt(shade.slice(3, 5), 16)));
                    const b = parseInt(color * (parseInt(shade.slice(5, 7), 16)));
                    imageData.data[idx] = r;
                    imageData.data[idx + 1] = g;
                    imageData.data[idx + 2] = b;
                }
                imageData.data[idx + 3] = 255; // Alpha channel
            }
        }

        ctx.putImageData(imageData, 0, 0);
        setLoading(false);
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
                        placeholder="e.g., z.real*z.real - z.imag*z.imag + c.real"
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
                        placeholder="e.g., Math.abs(2*z.real*z.imag) + c.imag"
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
                    {loading && <p>Generating fractal...</p>}
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