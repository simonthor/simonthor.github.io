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

type Diagram = {
    edges: Edge[];
    textBoxes: TextBox[];
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
 * (by dragging or with the arrow keys) or delete them. Several elements can be selected by holding ctrl.
 * Edges snap to a coarse grid and text to a finer one. Empty text boxes are removed as soon as editing ends.
 * Changes can be undone with ctrl+z and redone with ctrl+y (or ctrl+shift+z).
 * Edge styles include fermion (solid), gluon (spiral), boson (wave), and scalar (dashed), with optional arrows.
 * Exported SVG output includes both edge geometry and the MathJax-rendered text, placed as in the editor.
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
    // Snapped mouse position while drawing, used to preview the edge being drawn
    const [endPoint, setEndPoint] = useState<Point | null>(null);
    // Ids of the selected edges and text boxes
    const [selection, setSelection] = useState<string[]>([]);
    const [hoveringEdge, setHoveringEdge] = useState(false);
    const [editingText, setEditingText] = useState<string | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    // Previous and undone diagram states for undo and redo
    const undoStack = useRef<Diagram[]>([]);
    const redoStack = useRef<Diagram[]>([]);
    // The diagram before the text box currently being edited was changed, so that the edit can be undone
    const editStartRef = useRef<{ id: string; diagram: Diagram } | null>(null);
    // Mouse position at the start of a drag, the snapped distance the elements have been moved so far
    // and the diagram before the drag started
    const dragRef = useRef<{ ids: string[]; gridSize: number; mouse: Point; moved: Point; before: Diagram } | null>(null);

    const GRID_SIZE = 50; // Grid spacing for edges in pixels
    const TEXT_GRID_SIZE = 10; // Finer grid spacing for text in pixels
    const EDGE_HIT_THRESHOLD = 15; // Max distance in pixels from an edge that still counts as clicking it

    // Snap coordinate to grid
    const snapToGrid = (value: number, gridSize: number = GRID_SIZE): number => {
        return Math.round(value / gridSize) * gridSize;
    };

    // Save the diagram as it was before a change, so that the change can be undone
    const recordHistory = (diagram: Diagram = { edges, textBoxes }) => {
        undoStack.current.push(diagram);
        redoStack.current = [];
    };

    const moveElements = (ids: string[], dx: number, dy: number) => {
        if (dx === 0 && dy === 0) return;
        const move = (p: Point) => ({ x: p.x + dx, y: p.y + dy });
        setEdges(edges => edges.map(edge => ids.includes(edge.id) ? { ...edge, start: move(edge.start), end: move(edge.end) } : edge));
        setTextBoxes(boxes => boxes.map(tb => ids.includes(tb.id) ? { ...tb, position: move(tb.position) } : tb));
    };

    // Edges must stay on the edge grid, so a selection containing an edge moves on it
    const selectionGridSize = (ids: string[]) => edges.some(edge => ids.includes(edge.id)) ? GRID_SIZE : TEXT_GRID_SIZE;

    // Select the clicked element (or toggle it if ctrl is held) and start dragging the selection
    const handleElementMouseDown = (e: MouseEvent, id: string) => {
        const multiSelect = e.ctrlKey || e.metaKey;
        if (multiSelect && selection.includes(id)) {
            setSelection(selection.filter(selectedId => selectedId !== id));
            return;
        }
        // Clicking an already selected element drags the whole selection
        const ids = multiSelect ? [...selection, id] : selection.includes(id) ? selection : [id];
        setSelection(ids);
        dragRef.current = {
            ids,
            gridSize: selectionGridSize(ids),
            mouse: { x: e.clientX, y: e.clientY },
            moved: { x: 0, y: 0 },
            before: { edges, textBoxes }
        };
    };

    // Dragging is tracked on the window so that it keeps working when the cursor leaves the element or canvas
    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            const drag = dragRef.current;
            if (!drag) return;
            const x = snapToGrid(e.clientX - drag.mouse.x, drag.gridSize);
            const y = snapToGrid(e.clientY - drag.mouse.y, drag.gridSize);
            moveElements(drag.ids, x - drag.moved.x, y - drag.moved.y);
            drag.moved = { x, y };
        };
        const handleMouseUp = () => {
            const drag = dragRef.current;
            if (drag && (drag.moved.x !== 0 || drag.moved.y !== 0)) recordHistory(drag.before);
            dragRef.current = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Undo and redo changes, and delete, move or deselect the selected elements with the keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't interfere with typing in the text or font size inputs
            if (e.target instanceof HTMLInputElement) return;

            const key = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'y')) {
                e.preventDefault();
                const redo = key === 'y' || e.shiftKey;
                const [from, to] = redo ? [redoStack.current, undoStack.current] : [undoStack.current, redoStack.current];
                const diagram = from.pop();
                if (!diagram) return;
                to.push({ edges, textBoxes });
                setEdges(diagram.edges);
                setTextBoxes(diagram.textBoxes);
                setSelection([]);
                return;
            }

            if (selection.length === 0) return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                recordHistory();
                setEdges(edges.filter(edge => !selection.includes(edge.id)));
                setTextBoxes(textBoxes.filter(tb => !selection.includes(tb.id)));
                setSelection([]);
            } else if (e.key === 'Escape') {
                setSelection([]);
            } else if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                // Text moves on the finer grid unless shift is held
                const step = e.shiftKey ? GRID_SIZE : selectionGridSize(selection);
                const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
                const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
                recordHistory();
                moveElements(selection, dx, dy);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection, edges, textBoxes]);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        drawDiagram();
    }, [edges, selection, startPoint, endPoint, selectedEdgeType, showArrow]);

    // Text is only (re)rendered as math when editing of a text box ends or when undo/redo changes the text
    const textKey = textBoxes.map(tb => tb.id + tb.text).join('\n');
    useEffect(() => {
        if(typeof window?.MathJax !== "undefined" && overlayRef.current){
            const overlay = overlayRef.current;
            // Use requestAnimationFrame to ensure DOM is updated
            requestAnimationFrame(() => {
                window.MathJax.typesetPromise([overlay]).catch((err: Error) => console.error('MathJax typeset error:', err));
            });
        }
    }, [editingText, textKey]);

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

        // Preview the edge being drawn
        if (isDrawing && startPoint && endPoint && (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y)) {
            ctx.globalAlpha = 0.5;
            drawEdge(ctx, { id: 'preview', type: selectedEdgeType, start: startPoint, end: endPoint, showArrow });
            ctx.globalAlpha = 1;
        }
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
        const isSelected = selection.includes(edge.id);
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
            const point = { x: snapToGrid(mouseX), y: snapToGrid(mouseY) };
            setIsDrawing(true);
            setStartPoint(point);
            setEndPoint(point);
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
            // The diagram to return to on undo excludes the previous text box if it was empty and thus removed
            startEditing(newTextBox.id, { edges, textBoxes: textBoxes.filter(tb => tb.text.trim() !== '') });
        } else if (currentTool === 'select') {
            // Text boxes are handled by the overlay, so only edges can be clicked here
            const clickedEdge = findEdgeAt(mouseX, mouseY);
            if (clickedEdge) {
                handleElementMouseDown(e, clickedEdge.id);
            } else if (!e.ctrlKey && !e.metaKey) {
                setSelection([]);
            }
        }
    };

    const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (currentTool === 'draw' && isDrawing) {
            setEndPoint({ x: snapToGrid(mouseX), y: snapToGrid(mouseY) });
        } else if (currentTool === 'select' && !dragRef.current) {
            setHoveringEdge(findEdgeAt(mouseX, mouseY) !== null);
        }
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
                recordHistory();
                setEdges([...edges, newEdge]);
            }
            setIsDrawing(false);
            setStartPoint(null);
            setEndPoint(null);
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

    const startEditing = (id: string, diagram: Diagram = { edges, textBoxes }) => {
        editStartRef.current = { id, diagram };
        setEditingText(id);
    };

    // Stop editing a text box, remove it if it is empty and make the edit undoable if the text changed
    const finishEditing = (id: string) => {
        // Another text box may already be in edit mode, e.g. when a new one was created by clicking elsewhere
        setEditingText(current => current === id ? null : current);
        setTextBoxes(boxes => boxes.filter(tb => tb.id !== id || tb.text.trim() !== ''));

        // The edit may already have been finished, e.g. by both pressing enter and the resulting blur
        const editStart = editStartRef.current;
        if (editStart?.id !== id) return;
        editStartRef.current = null;
        const oldText = editStart.diagram.textBoxes.find(tb => tb.id === id)?.text ?? '';
        const newText = textBoxes.find(tb => tb.id === id)?.text ?? '';
        // Empty text boxes are removed, so an empty new text means that there is no text box
        if (oldText !== (newText.trim() ? newText : '')) recordHistory(editStart.diagram);
    };

    const switchTool = (tool: Tool) => {
        setCurrentTool(tool);
        setSelection([]);
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
        
        // Use the math exactly as MathJax rendered it in the editor, so that the text ends up at the same position
        const canvasRect = canvas.getBoundingClientRect();
        const mathSvgs = Array.from(overlayRef.current?.querySelectorAll('mjx-container > svg') ?? []).map(svg => {
            const rect = svg.getBoundingClientRect();
            return { svg, x: rect.left - canvasRect.left, y: rect.top - canvasRect.top, width: rect.width, height: rect.height };
        });
        mathSvgs.forEach(({ x, y, width, height }) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
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
        svgContent += `<defs><style>${svgCss}</style></defs>`;

        // Add text as nested SVGs placed at the same pixel position and size as in the editor
        mathSvgs.forEach(({ svg, x, y, width, height }) => {
            const clone = svg.cloneNode(true) as SVGSVGElement;
            clone.setAttribute('x', `${x}`);
            clone.setAttribute('y', `${y}`);
            clone.setAttribute('width', `${width}`);
            clone.setAttribute('height', `${height}`);
            // currentColor refers to the page's text color, which does not exist outside of it
            const g = clone.querySelector('g');
            g?.setAttribute('stroke', 'black');
            g?.setAttribute('fill', 'black');
            svgContent += new XMLSerializer().serializeToString(clone);
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
                            data-tooltip-html="Click on an edge or text to select it, then drag it or use the arrow keys to move it (hold shift to move text in larger steps).<br/>Hold ctrl while clicking to select several objects.<br/>Press delete or backspace to delete the selected objects, or escape to deselect them.<br/>Double-click on text to edit it.<br/>Press ctrl+z to undo and ctrl+y to redo."
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
                        // Cancel the edge being drawn, since the mouse may be released outside of the canvas
                        onMouseLeave={() => {
                            setIsDrawing(false);
                            setStartPoint(null);
                            setEndPoint(null);
                        }}
                    />
                    <TextOverlay ref={overlayRef}>
                        {textBoxes.map(textBox => (
                            <MathTextBox
                                key={textBox.id}
                                style={{ left: textBox.position.x, top: textBox.position.y }}
                                $fontSize={fontSize}
                                $selected={selection.includes(textBox.id)}
                                $tool={currentTool}
                                onMouseDown={(e) => {
                                    if (currentTool === 'select' && editingText !== textBox.id) {
                                        handleElementMouseDown(e, textBox.id);
                                    }
                                }}
                                onClick={() => {
                                    if (currentTool === 'text' && editingText !== textBox.id) {
                                        startEditing(textBox.id);
                                    }
                                }}
                                onDoubleClick={() => {
                                    if (currentTool === 'select') {
                                        setSelection([]);
                                        startEditing(textBox.id);
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
                                    // Keyed by the text so that a new element is typeset when undo/redo changes it,
                                    // since MathJax replaces the text node that React would otherwise update
                                    <p key={textBox.text} className="mathjax-content">{'$' + textBox.text + '$'}</p>
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
