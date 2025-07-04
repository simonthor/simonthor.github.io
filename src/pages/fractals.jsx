import { useState, useEffect, useRef } from 'react';

export default function Fractals() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState(null);
    
    // Add state for managing view position
    const [viewPosition, setViewPosition] = useState({
        xMin: -2, xMax: 1,
        yMin: -1.5, yMax: 1.5
    });
    // Track mouse state for panning
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

    // Function to render the fractal with current view position
    const renderFractal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const imageData = ctx.createImageData(width, height);

        // Mandelbrot parameters
        const maxIterations = 100;
        const { xMin, xMax, yMin, yMax } = viewPosition;

        setLoading(true);
        
        // Function to map pixel coordinates to complex plane
        const mapToComplex = (x, y) => ({
            real: xMin + (x / width) * (xMax - xMin),
            imag: yMin + (y / height) * (yMax - yMin)
        });

        // Compute the Mandelbrot set
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const c = mapToComplex(x, y);
                let z = { real: 0, imag: 0 };
                let iter = 0;

                // z = z^2 + c until |z| > 2 or max iterations
                while (z.real * z.real + z.imag * z.imag <= 4 && iter < maxIterations) {
                    const real = z.real * z.real - z.imag * z.imag + c.real;
                    const imag = 2 * z.real * z.imag + c.imag;
                    z.real = real;
                    z.imag = imag;
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
                    // Points outside are colored based on iteration count
                    const color = iter / maxIterations * 255;
                    imageData.data[idx] = color;
                    imageData.data[idx + 1] = 0;
                    imageData.data[idx + 2] = color * 2;
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
    }, [viewPosition]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="image-section" style={{ flex: 1, marginRight: '20px', textAlign: 'right' }}>
                    <h2>Your Image</h2>
                    <div className="upload-section" style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    {uploadedImage ? (
                        <img 
                            src={uploadedImage} 
                            alt="Uploaded content" 
                            style={{ maxWidth: '100%', maxHeight: '500px' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>No image uploaded</p>
                        </div>
                    )}
                </div>
                
                <div className="fractal-section" style={{ flex: 1 }}>
                    <h2>Mandelbrot Set</h2>
                    <p>Click and drag to pan, scroll to zoom</p>
                    {loading && <p>Generating fractal...</p>}
                    <p>Showing {viewPosition.xMin.toPrecision(4)} + {viewPosition.yMin.toPrecision(4)}i to {viewPosition.xMax.toPrecision(4)} + {viewPosition.yMax.toPrecision(4)}i</p>
                    <canvas 
                        ref={canvasRef} 
                        width={500} 
                        height={500}
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