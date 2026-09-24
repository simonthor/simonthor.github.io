import { useRef, useState, useEffect, MouseEvent } from 'react';
import { Tooltip } from 'react-tooltip';
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

type Tool = 'draw' | 'text' | 'select';

type Selection = {
    id: string;
    type: 'edge' | 'text';
};


const Container = styled.div`
    display: flex;
    height: 100%;
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
    user-select: none;
`;

const Canvas = styled.canvas`
    display: block;
`;

const TextOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const MathTextBox = styled.div<{ $fontSize: number; $selected: boolean; $tool: Tool }>`
    position: absolute;
    font-size: ${props => props.$fontSize}px;
    pointer-events: ${props => props.$tool === 'draw' ? 'none' : 'all'};
    cursor: ${props => props.$tool === 'select' ? 'move' : 'text'};
    isolation: isolate;
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
        /* Let clicks through to the box so MathJax's own click handling (explorer, focus) does not interfere */
        pointer-events: none;
    }

    /* Invisible padding that enlarges the clickable area around the label */
    &::before {
        content: '';
        position: absolute;
        inset: -8px;
        z-index: -1;
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

/**
 * Interactive Feynman diagram editor component with canvas-based edge rendering,
 * draggable MathJax text labels, grid snapping, keyboard deletion, and SVG export.
 *
 * @remarks
 * Supports three editing modes: drawing particle edges, adding/editing text, and selecting elements to move
 * (by dragging or with the arrow keys) or delete them. Edges snap to a coarse grid and text to a finer one.
 * Empty text boxes are removed as soon as editing ends.
 * Edge styles include fermion (solid), gluon (spiral), boson (wave), and scalar (dashed), with optional arrows.
 * Exported SVG output includes both edge geometry and MathJax-rendered text.
 *
 * For the associated action button, hovering should display a tooltip with help text
 * explaining what the button does (for example: “Export the current diagram as an SVG file”).
 */
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
    const [selection, setSelection] = useState<Selection | null>(null);
    const [hoveringEdge, setHoveringEdge] = useState(false);
    const [editingText, setEditingText] = useState<string | null>(null);
    // Mouse position at the start of a drag and the snapped distance the element has been moved so far
    const dragRef = useRef<{ selection: Selection; mouse: Point; moved: Point } | null>(null);

    const GRID_SIZE = 50; // Grid spacing for edges in pixels
    const TEXT_GRID_SIZE = 10; // Finer grid spacing for text in pixels
    const EDGE_HIT_THRESHOLD = 15; // Max distance in pixels from an edge that still counts as clicking it

    // Snap coordinate to grid
    const snapToGrid = (value: number, gridSize: number = GRID_SIZE): number => {
        return Math.round(value / gridSize) * gridSize;
    };

    const moveElement = (element: Selection, dx: number, dy: number) => {
        if (dx === 0 && dy === 0) return;
        if (element.type === 'edge') {
            setEdges(edges => edges.map(edge => edge.id === element.id ? {
                ...edge,
                start: { x: edge.start.x + dx, y: edge.start.y + dy },
                end: { x: edge.end.x + dx, y: edge.end.y + dy }
            } : edge));
        } else {
            setTextBoxes(boxes => boxes.map(tb => tb.id === element.id ? {
                ...tb,
                position: { x: tb.position.x + dx, y: tb.position.y + dy }
            } : tb));
        }
    };

    const startDrag = (e: MouseEvent, element: Selection) => {
        setSelection(element);
        dragRef.current = { selection: element, mouse: { x: e.clientX, y: e.clientY }, moved: { x: 0, y: 0 } };
    };

    // Dragging is tracked on the window so that it keeps working when the cursor leaves the element or canvas
    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            const drag = dragRef.current;
            if (!drag) return;
            const gridSize = drag.selection.type === 'edge' ? GRID_SIZE : TEXT_GRID_SIZE;
            const x = snapToGrid(e.clientX - drag.mouse.x, gridSize);
            const y = snapToGrid(e.clientY - drag.mouse.y, gridSize);
            moveElement(drag.selection, x - drag.moved.x, y - drag.moved.y);
            drag.moved = { x, y };
        };
        const handleMouseUp = () => {
            dragRef.current = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Delete, move or deselect the selected element with the keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't interfere with typing in the text or font size inputs
            if (!selection || e.target instanceof HTMLInputElement) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (selection.type === 'edge') {
                    setEdges(edges => edges.filter(edge => edge.id !== selection.id));
                } else {
                    setTextBoxes(boxes => boxes.filter(box => box.id !== selection.id));
                }
                setSelection(null);
            } else if (e.key === 'Escape') {
                setSelection(null);
            } else if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                // Edges must stay on the edge grid, text moves on the finer grid unless shift is held
                const step = selection.type === 'edge' || e.shiftKey ? GRID_SIZE : TEXT_GRID_SIZE;
                const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
                const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
                moveElement(selection, dx, dy);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection]);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        drawDiagram();
    }, [edges, selection]);

    // Text is only (re)rendered as math when editing of a text box ends
    useEffect(() => {
        if(typeof window?.MathJax !== "undefined"){
            // Use requestAnimationFrame to ensure DOM is updated
            requestAnimationFrame(() => {
                window.MathJax.typesetPromise().catch((err: Error) => console.error('MathJax typeset error:', err));
            });
        }
    }, [editingText]);

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
        // Highlight selected edge
        const isSelected = selection?.type === 'edge' && selection.id === edge.id;
        ctx.strokeStyle = isSelected ? '#0066cc' : '#000';
        ctx.lineWidth = isSelected ? 3 : 2;
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
        const loopRadius = 6; // Radius of the spiral loops
        const loopAdvance = 10; // How much the spiral advances along the line per loop
        const numLoops = Math.max(1, Math.floor(distance / loopAdvance));
        
        // Unit vector along the line
        const ux = dx / distance;
        const uy = dy / distance;
        
        // Perpendicular unit vector
        const perpX = -uy;
        const perpY = ux;

        ctx.beginPath();
        
        // Draw a continuous spiral using many small segments
        const segments = numLoops * 16; // 16 segments per loop for smoothness
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * numLoops * Math.PI * 2;
            
            // Position along the line
            const lineX = edge.start.x + dx * t;
            const lineY = edge.start.y + dy * t;
            
            // Offset perpendicular to line (creates the loop shape)
            const perpOffset = Math.sin(angle) * loopRadius;
            // Offset along the line direction (creates depth illusion of a 3D spring)
            const depthOffset = Math.cos(angle) * loopRadius * 0.8;
            
            const x = lineX + perpX * perpOffset + ux * depthOffset;
            const y = lineY + perpY * perpOffset + uy * depthOffset;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
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
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (currentTool === 'draw') {
            setIsDrawing(true);
            setStartPoint({ x: snapToGrid(mouseX), y: snapToGrid(mouseY) });
        } else if (currentTool === 'text') {
            // Prevent the canvas click from stealing focus from the new text input
            e.preventDefault();
            // The current input is unmounted without a blur event, so finish editing it explicitly
            if (editingText) finishEditing(editingText);
            const newTextBox: TextBox = {
                id: `text-${Date.now()}`,
                position: { x: snapToGrid(mouseX, TEXT_GRID_SIZE), y: snapToGrid(mouseY, TEXT_GRID_SIZE) },
                text: ''
            };
            setTextBoxes(boxes => [...boxes, newTextBox]);
            setEditingText(newTextBox.id);
        } else if (currentTool === 'select') {
            // Text boxes are handled by the overlay, so only edges can be clicked here
            const clickedEdge = findEdgeAt(mouseX, mouseY);
            if (clickedEdge) {
                startDrag(e, { id: clickedEdge.id, type: 'edge' });
            } else {
                setSelection(null);
            }
        }
    };

    const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || currentTool !== 'select' || dragRef.current) return;

        const rect = canvas.getBoundingClientRect();
        setHoveringEdge(findEdgeAt(e.clientX - rect.left, e.clientY - rect.top) !== null);
    };

    const handleCanvasMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        if (currentTool === 'draw' && isDrawing && startPoint) {
            // Ignore clicks that would create an edge of zero length
            if (x !== startPoint.x || y !== startPoint.y) {
                const newEdge: Edge = {
                    id: `edge-${Date.now()}`,
                    type: selectedEdgeType,
                    start: startPoint,
                    end: { x, y },
                    showArrow
                };
                setEdges([...edges, newEdge]);
            }
            setIsDrawing(false);
            setStartPoint(null);
        }
    };

    // Returns the edge closest to the given point, if any is within the hit threshold
    const findEdgeAt = (x: number, y: number): Edge | null => {
        let closestEdge: Edge | null = null;
        let closestDist = EDGE_HIT_THRESHOLD;
        for (const edge of edges) {
            const dist = distanceToLineSegment(x, y, edge.start, edge.end);
            if (dist < closestDist) {
                closestEdge = edge;
                closestDist = dist;
            }
        }
        return closestEdge;
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

    const updateTextBox = (id: string, text: string) => {
        setTextBoxes(textBoxes.map(tb =>
            tb.id === id ? { ...tb, text } : tb
        ));
    };

    // Stop editing a text box and remove it if it is empty
    const finishEditing = (id: string) => {
        // Another text box may already be in edit mode, e.g. when a new one was created by clicking elsewhere
        setEditingText(current => current === id ? null : current);
        setTextBoxes(boxes => boxes.filter(tb => tb.id !== id || tb.text.trim() !== ''));
    };

    const switchTool = (tool: Tool) => {
        setCurrentTool(tool);
        setSelection(null);
        setHoveringEdge(false);
    };

    const exportToSVG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Calculate bounding box of all content
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        // Calculate bounds from edges
        edges.forEach(edge => {
            minX = Math.min(minX, edge.start.x, edge.end.x);
            minY = Math.min(minY, edge.start.y, edge.end.y);
            maxX = Math.max(maxX, edge.start.x, edge.end.x);
            maxY = Math.max(maxY, edge.start.y, edge.end.y);
        });
        
        // Calculate bounds from text boxes (approximate with fontSize)
        textBoxes.forEach(textBox => {
            minX = Math.min(minX, textBox.position.x);
            minY = Math.min(minY, textBox.position.y);
            // Estimate text width and height (rough approximation)
            const estimatedWidth = textBox.text.length * fontSize * 0.6;
            const estimatedHeight = fontSize;
            maxX = Math.max(maxX, textBox.position.x + estimatedWidth);
            maxY = Math.max(maxY, textBox.position.y + estimatedHeight);
        });
        
        // If no content, use canvas size
        if (!isFinite(minX)) {
            minX = 0; minY = 0;
            maxX = canvas.width;
            maxY = canvas.height;
        }
        
        // Add padding, in units of pixels
        const padding = 20;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        
        const width = maxX - minX;
        const height = maxY - minY;

        // Create SVG element with viewBox for proper coordinate system
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" encoding="UTF-8" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">`;

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
            const adaptor: any = window.MathJax.startup.adaptor;
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
            const viewBoxMatch = mathSvg.match(/viewBox="([0-9.-]+) ([0-9.-]+) ([0-9.]+) ([0-9.]+)"/);
            
            if (svgMatch && widthMatch && viewBoxMatch) {
                const svgInner = svgMatch[1];
                const widthInEx = parseFloat(widthMatch[1]);
                const viewBoxMinX = parseFloat(viewBoxMatch[1]);
                const viewBoxMinY = parseFloat(viewBoxMatch[2]);
                const viewBoxWidth = parseFloat(viewBoxMatch[3]);
                const viewBoxHeight = parseFloat(viewBoxMatch[4]);
                
                // MathJax viewBox units need to be scaled to pixel coordinates
                // 1ex at default MathJax = 8px, so widthInEx * 8 = pixel width at default
                // But we want fontSize pixels for the height
                // The viewBox defines the coordinate system; we need to scale it to our fontSize
                
                // Calculate the scale to convert viewBox units to pixels
                // At MathJax default (16px font), widthInEx ex units = viewBoxWidth internal units
                // So: viewBoxWidth internal units = widthInEx * 8 pixels (at 1ex = 8px)
                // We want: fontSize pixels height, so scale accordingly
                const exToPixels = 8; // 1ex ≈ 8px at default font size
                const defaultPixelWidth = widthInEx * exToPixels;
                const targetPixelWidth = widthInEx * (fontSize / 2); // Scale based on fontSize
                
                // Scale from viewBox units to our target pixel size
                const scale = targetPixelWidth / viewBoxWidth;
                
                svgContent += `<g transform="translate(${textBox.position.x}, ${textBox.position.y + fontSize}) scale(${scale})"><g transform="translate(${-viewBoxMinX}, ${-viewBoxMinY})">${svgInner}</g></g>`;
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
            // For gluon and boson, use path with bezier curves
            const dx = edge.end.x - edge.start.x;
            const dy = edge.end.y - edge.start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (edge.type === 'gluon') {
                // Gluon continuous spiral
                const loopRadius = 6;
                const loopAdvance = 10;
                const numLoops = Math.max(1, Math.floor(distance / loopAdvance));
                
                const ux = dx / distance;
                const uy = dy / distance;
                const perpX = -uy;
                const perpY = ux;
                
                // Build polyline points for the spiral
                const points: string[] = [];
                const segments = numLoops * 16;
                
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    const angle = t * numLoops * Math.PI * 2;
                    
                    const lineX = edge.start.x + dx * t;
                    const lineY = edge.start.y + dy * t;
                    
                    const perpOffset = Math.sin(angle) * loopRadius;
                    const depthOffset = Math.cos(angle) * loopRadius * 0.8;
                    
                    const x = lineX + perpX * perpOffset + ux * depthOffset;
                    const y = lineY + perpY * perpOffset + uy * depthOffset;
                    
                    points.push(`${x},${y}`);
                }
                
                svg = `<polyline points="${points.join(' ')}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
            } else {
                // Boson wave using polyline
                const points: string[] = [];
                for (let i = 0; i <= 100; i++) {
                    const t = i / 100;
                    const x = edge.start.x + dx * t;
                    const y = edge.start.y + dy * t;
                    const perpX = -dy / distance;
                    const perpY = dx / distance;
                    const amplitude = 10;
                    const offset = amplitude * Math.sin(t * distance / 20 * Math.PI * 2);
                    points.push(`${x + perpX * offset},${y + perpY * offset}`);
                }
                svg = `<polyline points="${points.join(' ')}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
            }
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

    return (
        <>
            <h1>Feynman Diagram Editor</h1>
            
            <Container>
                <Sidebar>
                    <ToolSection>
                        <SectionTitle>Tool</SectionTitle>
                        <ToolButton
                            $active={currentTool === 'draw'}
                            onClick={() => switchTool('draw')}
                        >
                            Draw Edge
                        </ToolButton>
                        <ToolButton
                            $active={currentTool === 'text'}
                            onClick={() => switchTool('text')}
                        >
                            Add Text
                        </ToolButton>
                        <ToolButton
                            $active={currentTool === 'select'}
                            onClick={() => switchTool('select')}
                            id="select-button"
                            data-tooltip-id="select-tooltip"
                            data-tooltip-place="bottom"
                            data-tooltip-html="Click on an edge or text to select it, then drag it or use the arrow keys to move it (hold shift to move text in larger steps).<br/>Press delete or backspace to delete the selected object, or escape to deselect it.<br/>Double-click on text to edit it."
                        >
                            Select / Move / Delete
                        </ToolButton>
                        <Tooltip
                            id="select-tooltip"
                            place="bottom"
                            variant="dark"
                            positionStrategy="fixed"
                            style={{ zIndex: 9999 }}
                        />
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
                        <ExportButton onClick={exportToSVG}>
                            Export to SVG
                        </ExportButton>
                    </ToolSection>
                </Sidebar>

                <CanvasContainer>
                    <Canvas
                        ref={canvasRef}
                        style={{ cursor: currentTool !== 'select' ? 'crosshair' : hoveringEdge ? 'move' : 'default' }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                    />
                    <TextOverlay>
                        {textBoxes.map(textBox => (
                            <MathTextBox
                                key={textBox.id}
                                style={{ left: textBox.position.x, top: textBox.position.y }}
                                $fontSize={fontSize}
                                $selected={selection?.type === 'text' && selection.id === textBox.id}
                                $tool={currentTool}
                                onMouseDown={(e) => {
                                    if (currentTool === 'select' && editingText !== textBox.id) {
                                        startDrag(e, { id: textBox.id, type: 'text' });
                                    }
                                }}
                                onClick={() => {
                                    if (currentTool === 'text') {
                                        setEditingText(textBox.id);
                                    }
                                }}
                                onDoubleClick={() => {
                                    if (currentTool === 'select') {
                                        setSelection(null);
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
                                        onBlur={() => finishEditing(textBox.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === 'Escape') {
                                                finishEditing(textBox.id);
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
