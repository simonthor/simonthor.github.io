import { useState, useEffect, useRef } from 'react';

export default function Fractals() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        const imageData = ctx.createImageData(width, height);

        // Mandelbrot parameters
        const maxIterations = 100;
        const xMin = -2, xMax = 1;
        const yMin = -1.5, yMax = 1.5;

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
    }, []);

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

    return (
        <div className="fractal-container">
            <div className="upload-section" style={{ marginBottom: '20px', textAlign: 'left' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginBottom: '10px' }}
                />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="image-section" style={{ flex: 1, marginRight: '20px', textAlign: 'right' }}>
                    <h2>Your Image</h2>
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
                    {loading && <p>Generating fractal...</p>}
                    <canvas 
                        ref={canvasRef} 
                        width={500} 
                        height={500} 
                    />
                </div>
            </div>
        </div>
    );
}