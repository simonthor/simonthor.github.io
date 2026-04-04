import { useRef, useState, useEffect, MouseEvent } from 'react';
import styled from 'styled-components';

// Types for Feynman diagram elements
export type EdgeType = 'fermion' | 'gluon' | 'boson' | 'scalar';

export type Point = {
    x: number;
    y: number;
};

export type Edge = {
    id: string;
    type: EdgeType;
    start: Point;
    end: Point;
    showArrow: boolean;
};

export type TextBox = {
    id: string;
    position: Point;
    text: string;
};

type DiagramElement = {
    id: string;
    type: 'edge' | 'text';
};

type Tool = 'draw' | 'text' | 'move';

// Styled components
const Container = styled.div`
    display: flex;
    height: calc(100vh - 100px);
    gap: 1rem;
`;

const Sidebar = styled.div`
    width: 250px;
    background: rgba(0, 15, 41, 0.8);
    padding: 1rem;
    border-radius: 8px;
    overflow-y: auto;
`;

const ToolSection = styled.div`
    margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
    color: #fff;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
    width: 100%;
    padding: 0.75rem;
    margin: 0.25rem 0;
    background: ${props => props.$active ? '#0F79D0' : '#1a2332'};
    color: #fff;
    border: 1px solid ${props => props.$active ? '#0F79D0' : '#2b3544'};
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    
    &:hover {
        background: ${props => props.$active ? '#0c5fa0' : '#243142'};
        border-color: #0F79D0;
    }
`;

const ToggleButton = styled(ToolButton)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CheckIcon = styled.span<{ $checked: boolean }>`
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 3px;
    background: ${props => props.$checked ? '#0F79D0' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:after {
        content: '✓';
        color: #fff;
        font-size: 12px;
        opacity: ${props => props.$checked ? 1 : 0};
    }
`;

const FontSizeControl = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FontSizeInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    background: #1a2332;
    color: #fff;
    border: 1px solid #2b3544;
    border-radius: 4px;
    font-size: 0.85rem;
`;

const ExportButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    margin: 0.25rem 0;
    background: #1a5f3a;
    color: #fff;
    border: 1px solid #2b7544;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    
    &:hover {
        background: #246d47;
        border-color: #2b7544;
    }
`;

const CanvasContainer = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Canvas = styled.canvas`
    display: block;
    cursor: crosshair;
    
    &.move-cursor {
        cursor: move;
    }
`;

const TextOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const MathTextBox = styled.div<{ $x: number; $y: number; $fontSize: number; $selected: boolean }>`
    position: absolute;
    left: ${props => props.$x}px;
    top: ${props => props.$y}px;
    font-size: ${props => props.$fontSize}px;
    pointer-events: all;
    cursor: ${props => props.$selected ? 'move' : 'default'};
    background: ${props => props.$selected ? 'rgba(15, 121, 208, 0.2)' : 'rgba(255, 255, 255, 0.7)'};
    padding: 2px 4px;
    border-radius: 2px;
    user-select: none;
    min-width: 20px;
    min-height: 20px;
    color: #000;
    
    & p {
        color: #000;
        margin: 0;
    }
`;

const TextInput = styled.input`
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #0F79D0;
    color: #000;
    font-family: inherit;
    font-size: inherit;
    outline: none;
    width: 200px;
    padding: 4px;
    border-radius: 2px;
`;

const FeynmanDiagram = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
    const [currentTool, setCurrentTool] = useState<Tool>('draw');
    const [selectedEdgeType, setSelectedEdgeType] = useState<EdgeType>('fermion');
    const [showArrow, setShowArrow] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [selectedElementType, setSelectedElementType] = useState<'edge' | 'text' | null>(null);
    const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
    const [editingText, setEditingText] = useState<string | null>(null);

    const GRID_SIZE = 50; // Grid spacing in pixels

    // Snap coordinate to grid
    const snapToGrid = (value: number): number => {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    };

    const snapPointToGrid = (point: Point): Point => {
        return {
            x: snapToGrid(point.x),
            y: snapToGrid(point.y)
        };
    };

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        drawDiagram();

        if(typeof window?.MathJax !== "undefined"){
            // Use requestAnimationFrame to ensure DOM is updated
            requestAnimationFrame(() => {
                window.MathJax.typesetPromise().catch((err: Error) => console.error('MathJax typeset error:', err));
            });
        }
    }, [edges, textBoxes, fontSize]);

    // Draw the diagram
    const drawDiagram = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        drawGrid(ctx, canvas.width, canvas.height);

        // Draw edges
        edges.forEach(edge => {
            drawEdge(ctx, edge);
        });
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;

        // Draw vertical lines
        for (let x = 0; x <= width; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= height; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw grid points
        ctx.fillStyle = '#bbb';
        for (let x = 0; x <= width; x += GRID_SIZE) {
            for (let y = 0; y <= height; y += GRID_SIZE) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    const drawEdge = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        switch (edge.type) {
            case 'fermion':
                drawFermionLine(ctx, edge);
                break;
            case 'gluon':
                drawGluonLine(ctx, edge);
                break;
            case 'boson':
                drawBosonLine(ctx, edge);
                break;
            case 'scalar':
                drawScalarLine(ctx, edge);
                break;
        }

        if (edge.showArrow) {
            drawArrow(ctx, edge);
        }
    };

    const drawFermionLine = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        ctx.beginPath();
        ctx.moveTo(edge.start.x, edge.start.y);
        ctx.lineTo(edge.end.x, edge.end.y);
        ctx.stroke();
    };

    const drawGluonLine = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        const dx = edge.end.x - edge.start.x;
        const dy = edge.end.y - edge.start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 6; // Radius of the spiral coils
        const coilSpacing = 15; // Distance between coil centers
        const numCoils = Math.floor(distance / coilSpacing);
        
        // Unit vector along the line
        const ux = dx / distance;
        const uy = dy / distance;
        
        // Perpendicular unit vector
        const perpX = -uy;
        const perpY = ux;

        ctx.beginPath();
        
        // Draw spiral as series of circles
        for (let coil = 0; coil < numCoils; coil++) {
            const centerT = (coil + 0.5) / numCoils;
            const centerX = edge.start.x + dx * centerT;
            const centerY = edge.start.y + dy * centerT;
            
            // Draw circular coil
            for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 8) {
                const spiralX = centerX + perpX * radius * Math.cos(angle);
                const spiralY = centerY + perpY * radius * Math.cos(angle);
                const spiralZ = radius * Math.sin(angle);
                
                // Project 3D spiral onto 2D (along line direction for depth)
                const projX = spiralX + ux * spiralZ * 0.3;
                const projY = spiralY + uy * spiralZ * 0.3;
                
                if (coil === 0 && angle === 0) {
                    ctx.moveTo(projX, projY);
                } else {
                    ctx.lineTo(projX, projY);
                }
            }
        }
        
        ctx.stroke();
    };

    const drawBosonLine = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        const dx = edge.end.x - edge.start.x;
        const dy = edge.end.y - edge.start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const amplitude = 10;
        const wavelength = 20;

        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const x = edge.start.x + dx * t;
            const y = edge.start.y + dy * t;
            
            const perpX = -dy / distance;
            const perpY = dx / distance;
            
            const offset = amplitude * Math.sin(t * distance / wavelength * Math.PI * 2);
            const finalX = x + perpX * offset;
            const finalY = y + perpY * offset;
            
            if (i === 0) {
                ctx.moveTo(finalX, finalY);
            } else {
                ctx.lineTo(finalX, finalY);
            }
        }
        ctx.stroke();
    };

    const drawScalarLine = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(edge.start.x, edge.start.y);
        ctx.lineTo(edge.end.x, edge.end.y);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const drawArrow = (ctx: CanvasRenderingContext2D, edge: Edge) => {
        const midX = (edge.start.x + edge.end.x) / 2;
        const midY = (edge.start.y + edge.end.y) / 2;
        const angle = Math.atan2(edge.end.y - edge.start.y, edge.end.x - edge.start.x);
        const arrowSize = 10;

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(
            midX - arrowSize * Math.cos(angle - Math.PI / 6),
            midY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            midX - arrowSize * Math.cos(angle + Math.PI / 6),
            midY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    };

    const handleCanvasMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        if (currentTool === 'draw') {
            setIsDrawing(true);
            setStartPoint({ x, y });
        } else if (currentTool === 'text') {
            // Add text box
            const newTextBox: TextBox = {
                id: `text-${Date.now()}`,
                position: { x, y },
                text: ''
            };
            setTextBoxes([...textBoxes, newTextBox]);
            // Use setTimeout to ensure the textbox is rendered before setting edit mode
            setTimeout(() => setEditingText(newTextBox.id), 10);
        } else if (currentTool === 'move') {
            // Find element to move (edges only, text handled by overlay)
            const clickedEdge = findEdgeAt(x, y);
            if (clickedEdge) {
                setSelectedElement(clickedEdge.id);
                setSelectedElementType('edge');
                setDragOffset({
                    x: x - clickedEdge.start.x,
                    y: y - clickedEdge.start.y
                });
            }
        }
    };

    const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        if (currentTool === 'move' && selectedElement && selectedElementType === 'edge') {
            // Move selected edge
            moveEdge(selectedElement, x - dragOffset.x, y - dragOffset.y);
        }
    };

    const handleCanvasMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        if (currentTool === 'draw' && isDrawing && startPoint) {
            const newEdge: Edge = {
                id: `edge-${Date.now()}`,
                type: selectedEdgeType,
                start: startPoint,
                end: { x, y },
                showArrow
            };
            setEdges([...edges, newEdge]);
            setIsDrawing(false);
            setStartPoint(null);
        } else if (currentTool === 'move') {
            setSelectedElement(null);
            setSelectedElementType(null);
        }
    };

    const findEdgeAt = (x: number, y: number): Edge | null => {
        const threshold = 10;
        for (const edge of edges) {
            // Simple distance to line segment check
            const dist = distanceToLineSegment(x, y, edge.start, edge.end);
            if (dist < threshold) {
                return edge;
            }
        }
        return null;
    };

    const distanceToLineSegment = (px: number, py: number, p1: Point, p2: Point): number => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lengthSquared = dx * dx + dy * dy;
        
        if (lengthSquared === 0) {
            return Math.sqrt((px - p1.x) ** 2 + (py - p1.y) ** 2);
        }
        
        let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        
        const nearestX = p1.x + t * dx;
        const nearestY = p1.y + t * dy;
        
        return Math.sqrt((px - nearestX) ** 2 + (py - nearestY) ** 2);
    };

    const moveEdge = (id: string, newStartX: number, newStartY: number) => {
        setEdges(edges.map(edge => {
            if (edge.id === id) {
                const dx = newStartX - edge.start.x;
                const dy = newStartY - edge.start.y;
                return {
                    ...edge,
                    start: { x: newStartX, y: newStartY },
                    end: { x: edge.end.x + dx, y: edge.end.y + dy }
                };
            }
            return edge;
        }));
    };

    const moveTextBox = (id: string, x: number, y: number) => {
        setTextBoxes(textBoxes.map(tb =>
            tb.id === id ? { ...tb, position: { x, y } } : tb
        ));
    };

    const updateTextBox = (id: string, text: string) => {
        setTextBoxes(textBoxes.map(tb =>
            tb.id === id ? { ...tb, text } : tb
        ));
    };

    const handleTextMouseDown = (e: MouseEvent<HTMLDivElement>, textBox: TextBox) => {
        if (currentTool === 'move') {
            e.stopPropagation();
            setSelectedElement(textBox.id);
            setSelectedElementType('text');
            const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left - textBox.position.x,
                    y: e.clientY - rect.top - textBox.position.y
                });
            }
        }
    };

    const handleTextMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (currentTool === 'move' && selectedElement && selectedElementType === 'text') {
            e.stopPropagation();
            const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
            if (rect) {
                const x = snapToGrid(e.clientX - rect.left - dragOffset.x);
                const y = snapToGrid(e.clientY - rect.top - dragOffset.y);
                moveTextBox(selectedElement, x, y);
            }
        }
    };

    const handleTextMouseUp = () => {
        if (selectedElementType === 'text') {
            setSelectedElement(null);
            setSelectedElementType(null);
        }
    };

    const exportToSVG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create SVG element
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" encoding="UTF-8" width="${canvas.width}" height="${canvas.height}">`;

        // Add edges
        edges.forEach(edge => {
            svgContent += edgeToSVG(edge);
        });
        
        const svgCss = [
            'svg a{fill:blue;stroke:blue}',
            '[data-mml-node="merror"]>g{fill:red;stroke:red}',
            '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
            '[data-frame],[data-line]{stroke-width:70px;fill:none}',
            '.mjx-dashed{stroke-dasharray:140}',
            '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
            'use[data-c]{stroke-width:3px}'
        ].join('');

        function getSvgImage(math, options = {}) {
            const SVGXMLNS = "http://www.w3.org/2000/svg";
            const adaptor = window.MathJax.startup.adaptor;
            const result = window.MathJax.tex2svg(math, options);
            const svg = adaptor.tags(result, 'svg')[0];
            const defs = adaptor.tags(svg, 'defs')[0] || adaptor.append(svg, adaptor.create('defs'));
            adaptor.append(defs, adaptor.node('style', {}, [adaptor.text(svgCss)], SVGXMLNS));
            adaptor.removeAttribute(svg, 'role');
            adaptor.removeAttribute(svg, 'focusable');
            adaptor.removeAttribute(svg, 'aria-hidden');
            const g = adaptor.tags(svg, 'g')[0];
            adaptor.setAttribute(g, 'stroke', 'black');
            adaptor.setAttribute(g, 'fill', 'black');
            return adaptor.serializeXML(svg);
        }

        // Add text boxes
        textBoxes.forEach(textBox => {
            // Get the MathJax SVG for the text
            const mathSvg = getSvgImage(textBox.text);
            
            // Extract the SVG attributes and content
            const svgMatch = mathSvg.match(/<svg[^>]*>(.*)<\/svg>/s);
            const widthMatch = mathSvg.match(/width="([0-9.]+)ex"/);
            const viewBoxMatch = mathSvg.match(/viewBox="[0-9.-]+ [0-9.-]+ ([0-9.]+) [0-9.]+"/);
            
            if (svgMatch) {
                const svgInner = svgMatch[1];
                
                // Calculate scale based on desired fontSize
                // MathJax default renders at ~16px font size (1ex ≈ 8px at default)
                // The viewBox width in units / width in ex gives us units per ex
                let scale = 1;
                if (widthMatch && viewBoxMatch) {
                    const widthInEx = parseFloat(widthMatch[1]);
                    const viewBoxWidth = parseFloat(viewBoxMatch[1]);
                    const unitsPerEx = viewBoxWidth / widthInEx;
                    
                    // Target: fontSize pixels should equal widthInEx * exToPixels
                    // MathJax default: 1ex ≈ 8px
                    // So scale to make the SVG match our fontSize
                    scale = (fontSize / 16); // fontSize / default MathJax font size
                }
                
                svgContent += `<g transform="translate(${textBox.position.x}, ${textBox.position.y + fontSize}) scale(${scale})">${svgInner}</g>`;
            }
        });

        svgContent += '</svg>';

        // Download
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'feynman-diagram.svg';
        link.click();
        URL.revokeObjectURL(url);
    };

    const edgeToSVG = (edge: Edge): string => {
        let svg = '';
        
        if (edge.type === 'fermion') {
            svg = `<line x1="${edge.start.x}" y1="${edge.start.y}" x2="${edge.end.x}" y2="${edge.end.y}" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
        } else if (edge.type === 'scalar') {
            svg = `<line x1="${edge.start.x}" y1="${edge.start.y}" x2="${edge.end.x}" y2="${edge.end.y}" stroke="black" stroke-width="2" stroke-dasharray="10,5" stroke-linecap="round"/>`;
        } else {
            // For gluon and boson, approximate with polyline
            const points: string[] = [];
            const dx = edge.end.x - edge.start.x;
            const dy = edge.end.y - edge.start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            for (let i = 0; i <= 100; i++) {
                const t = i / 100;
                const x = edge.start.x + dx * t;
                const y = edge.start.y + dy * t;
                
                if (edge.type === 'gluon') {
                    // Simplified gluon
                    const perpX = -dy / distance;
                    const perpY = dx / distance;
                    const radius = 6;
                    const angle = t * Math.floor(distance / 15) * Math.PI * 2;
                    const offsetX = perpX * radius * Math.cos(angle);
                    const offsetY = perpY * radius * Math.cos(angle);
                    points.push(`${x + offsetX},${y + offsetY}`);
                } else {
                    // Boson wave
                    const perpX = -dy / distance;
                    const perpY = dx / distance;
                    const amplitude = 10;
                    const offset = amplitude * Math.sin(t * distance / 20 * Math.PI * 2);
                    points.push(`${x + perpX * offset},${y + perpY * offset}`);
                }
            }
            svg = `<polyline points="${points.join(' ')}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
        }
        
        if (edge.showArrow) {
            const midX = (edge.start.x + edge.end.x) / 2;
            const midY = (edge.start.y + edge.end.y) / 2;
            const angle = Math.atan2(edge.end.y - edge.start.y, edge.end.x - edge.start.x);
            const arrowSize = 10;
            const points = [
                `${midX},${midY}`,
                `${midX - arrowSize * Math.cos(angle - Math.PI / 6)},${midY - arrowSize * Math.sin(angle - Math.PI / 6)}`,
                `${midX - arrowSize * Math.cos(angle + Math.PI / 6)},${midY - arrowSize * Math.sin(angle + Math.PI / 6)}`
            ];
            svg += `<polygon points="${points.join(' ')}" fill="black"/>`;
        }
        
        return svg;
    };

    const escapeHtml = (text: string): string => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const exportToPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'feynman-diagram.png';
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    const exportToPDF = async () => {
        // For PDF export, we'll use a simple approach: convert canvas to image and embed in PDF
        // In a real app, you'd use a library like jsPDF
        alert('PDF export requires additional library (jsPDF). For now, please use SVG or PNG export.');
    };

    return (
        <>
            <h1>Feynman Diagram Editor</h1>
            <p>Create interactive Feynman diagrams with various particle types.</p>
            
            <Container>
                <Sidebar>
                    <ToolSection>
                        <SectionTitle>Tool</SectionTitle>
                        <ToolButton
                            $active={currentTool === 'draw'}
                            onClick={() => setCurrentTool('draw')}
                        >
                            Draw Edge
                        </ToolButton>
                        <ToolButton
                            $active={currentTool === 'text'}
                            onClick={() => setCurrentTool('text')}
                        >
                            Add Text
                        </ToolButton>
                        <ToolButton
                            $active={currentTool === 'move'}
                            onClick={() => setCurrentTool('move')}
                        >
                            Move
                        </ToolButton>
                    </ToolSection>

                    {currentTool === 'draw' && (
                        <>
                            <ToolSection>
                                <SectionTitle>Edge Type</SectionTitle>
                                <ToolButton
                                    $active={selectedEdgeType === 'fermion'}
                                    onClick={() => setSelectedEdgeType('fermion')}
                                >
                                    Fermion (Line)
                                </ToolButton>
                                <ToolButton
                                    $active={selectedEdgeType === 'gluon'}
                                    onClick={() => setSelectedEdgeType('gluon')}
                                >
                                    Gluon (Spiral)
                                </ToolButton>
                                <ToolButton
                                    $active={selectedEdgeType === 'boson'}
                                    onClick={() => setSelectedEdgeType('boson')}
                                >
                                    Electroweak Boson (Wave)
                                </ToolButton>
                                <ToolButton
                                    $active={selectedEdgeType === 'scalar'}
                                    onClick={() => setSelectedEdgeType('scalar')}
                                >
                                    Scalar Boson (Dashed)
                                </ToolButton>
                            </ToolSection>

                            <ToolSection>
                                <SectionTitle>Options</SectionTitle>
                                <ToggleButton onClick={() => setShowArrow(!showArrow)}>
                                    <span>Show Arrow</span>
                                    <CheckIcon $checked={showArrow} />
                                </ToggleButton>
                            </ToolSection>
                        </>
                    )}

                    <ToolSection>
                        <SectionTitle>
                            Font Size
                        </SectionTitle>
                        <p>\(\nu\) $\mu$</p>
                        <FontSizeControl>
                            <FontSizeInput
                                type="number"
                                min="8"
                                max="48"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </FontSizeControl>
                    </ToolSection>

                    <ToolSection>
                        <SectionTitle>Export</SectionTitle>
                        <ExportButton onClick={exportToSVG}>
                            Export to SVG
                        </ExportButton>
                        <ExportButton onClick={exportToPNG}>
                            Export to PNG
                        </ExportButton>
                        <ExportButton onClick={exportToPDF}>
                            Export to PDF
                        </ExportButton>
                    </ToolSection>
                </Sidebar>

                <CanvasContainer>
                    <Canvas
                        ref={canvasRef}
                        className={currentTool === 'move' ? 'move-cursor' : ''}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                    />
                    <TextOverlay 
                        onMouseMove={handleTextMouseMove}
                        onMouseUp={handleTextMouseUp}
                    >
                        {textBoxes.map(textBox => (
                            <MathTextBox
                                key={textBox.id}
                                $x={textBox.position.x}
                                $y={textBox.position.y}
                                $fontSize={fontSize}
                                $selected={selectedElement === textBox.id}
                                onMouseDown={(e) => handleTextMouseDown(e, textBox)}
                                onClick={() => {
                                    if (currentTool !== 'move') {
                                        setEditingText(textBox.id);
                                    }
                                }}
                            >
                                {editingText === textBox.id ? (
                                    <TextInput
                                        autoFocus
                                        value={textBox.text}
                                        placeholder="Enter text or LaTeX (e.g., $E = mc^2$ or $\\nu$)"
                                        onChange={(e) => updateTextBox(textBox.id, e.target.value)}
                                        onBlur={() => setEditingText(null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditingText(null);
                                            }
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : textBox.text ? (
                                    <p className="mathjax-content">{'$' + textBox.text + '$'}</p>
                                ) : <></>}
                            </MathTextBox>
                        ))}
                    </TextOverlay>
                </CanvasContainer>
            </Container>
        </>
    );
};

export default FeynmanDiagram;
