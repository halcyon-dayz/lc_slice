import React, {useState, useCallback, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"

type XY = {
    x: number,
    y: number
}

//Needed for edges as I understand it
type Node<T> = {
    x: number,
    y: number, 
    ix: number, 
    iy: number,
    radius: number,
    links: T[],
}


type GraphNodeStateDeclarativeType= {
    hasMoved: boolean,
    isInFront: boolean,
    isBeingDragged: boolean,
    originalEventTarget: EventTarget | null,
    onMouseUpCallback: (this: any, event: MouseEvent) => any,
    onMouseMoveCallback: (this: any, event: MouseEvent) => any,
}


type NodeType = {
    x: number,
    y: number,
    ix: number,
    iy: number,
    radius: number, 
    links: EdgeImperativeType[],
}

type EdgeImperativeType = {
    nodeOne: NodeType,
    nodeTwo: NodeType,
    elm: SVGLineElement,
    x1: number,
    x2: number,
    y1: number, 
    y2: number
}

type nodeImperativeType = {
    mouseStart: {
        x: number,
        y: number
    }
    nodeStart: {
        x: number, 
        y: number
    },
    node: {
        x: number, 
        y: number,
        ix: number,
        iy: number,
        radius: number,
        links: EdgeImperativeType[],
    }
}



export type GraphProps = {
    width: number,
}

export const Graph = ({width}: GraphProps) => {

    const [svgWidth, setSvgWidth] = useState<number>(width);
    const [svgHeight, setSvgHeight] = useState<number>(450.0);

    useEffect(() => {
        setSvgWidth(width);
    }, [width])

    const selectedNode = useRef<number>(0);

    const edge = useRef<SVGLineElement>(null);

    const edgeState = useRef<EdgeImperativeType>(null);

    //Ref of the entire graph
    const graphSVGRef = useRef<SVGSVGElement>(null);
    //Forwareded ref from GraphNodeObject
    const nodes = useRef<SVGGElement[]>([]);
    //We separate the state of the node from its reference, which might need to be changed in the future
    const nodeStates = useRef<nodeImperativeType[]>([
        {
            mouseStart: {
                x: 0,
                y: 0
            },
            nodeStart: {
                x: 0,
                y: 0,
            },
            node: {
                x: 200,
                y: 200, 
                ix: 200,
                iy: 200,
                radius: 30,
                links: [],
            }
        },
        {
            mouseStart: {
                x: 0,
                y: 0
            },
            nodeStart: {
                x: 0,
                y: 0,
            },
            node: {
                x: 200,
                y: 200, 
                ix: 200,
                iy: 200,
                radius: 30,
                links: [],
            }
        }
    ]);
    const [dragState, updateDrag] = useImmer<GraphNodeStateDeclarativeType>({
        hasMoved : false,
        isInFront: false,
        isBeingDragged: false,
        originalEventTarget: null,
        onMouseMoveCallback: (event: MouseEvent) => {
            updateDrag(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseMove(event);
        },
        onMouseUpCallback: (event: MouseEvent) => {
            updateDrag(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseUp(event);
        },
    })


    const startMove = (index: number, x: number, y: number) => {
        //Certain fields are not yet populated but will be when the callback is first called
        nodeStates.current[index].mouseStart.x = x;
        nodeStates.current[index].mouseStart.y = y;
        nodeStates.current[index].nodeStart.x = nodeStates.current[index].node.x;
        nodeStates.current[index].nodeStart.y = nodeStates.current[index].node.y;
        updateDrag(state => {state.hasMoved = false});
        updateDrag(state => {state.isInFront = false});
        updateDrag(state => {state.isBeingDragged = true});
        updateDrag(state => {state.originalEventTarget = null});
    }

    const moveNodeOnMouseMove = useCallback( (e: MouseEvent) => {
        //Get the currently selected node
        let curNode = selectedNode.current !== undefined ? selectedNode.current : 0;
        updateDrag(state => {
            state.isBeingDragged = true;
        })

        //Set svgWidth if it has not yet been set
        if (graphSVGRef.current !== null) {
            setSvgWidth(graphSVGRef.current.clientWidth);
            setSvgHeight(graphSVGRef.current.clientHeight);
        }

        //Get new mouse coordinates
        const newMouseX = e.clientX;
        const newMouseY = e.clientY;
        updateDrag(state => {state.originalEventTarget = null});

        //If the mouse has moved from its starting position at mouse down
        if (
            newMouseX !== nodeStates.current[curNode].mouseStart.x || 
            newMouseY !== nodeStates.current[curNode].mouseStart.y) {
            //Indicate that the mouse has indeed moved
            updateDrag(state => {state.hasMoved = true})
        }

        let newNodePosX = 
            nodeStates.current[curNode].nodeStart.x + 
            newMouseX - 
            nodeStates.current[curNode].mouseStart.x
        ;

        let newNodePosY = 
            nodeStates.current[curNode].nodeStart.y +
            newMouseY - 
            nodeStates.current[curNode].mouseStart.y
        ;


        let nodeRadius = nodeStates.current[curNode].node.radius;

        //Move the node to where the node object lay + (new position of mouse - where the mouse started)
        nodeStates.current[curNode].node.x = newNodePosX;
        nodeStates.current[curNode].node.y = newNodePosY;
        let prevIX = nodeStates.current[curNode].node.ix
        let prevIY = nodeStates.current[curNode].node.iy
        let x = newNodePosX - prevIX;
        let y = newNodePosY - prevIY;

        nodes.current[curNode].setAttribute("transform", "translate(" + (x) + "," + (y) + ")")
        return false;
    }, [width])

    const moveNodeOnMouseUp = (e: MouseEvent) => {
        const curNode = selectedNode.current
        console.log("Mouse up on node")
        //Node is no longer being dragged
        updateDrag(state => {state.isBeingDragged = false});
        nodeStates.current[curNode].node.radius = nodeStates.current[curNode].node.radius / 1.5;;

        document.removeEventListener("mousemove", dragState.onMouseMoveCallback, false);
        document.removeEventListener("mouseup", dragState.onMouseUpCallback, false);
        return false;
    }

    //TODO: Mouse Event or React.MouseEvent
    const moveNodeOnMouseDown = (e: MouseEvent, index: number) => {
        console.log("Mouse down on node")
        selectedNode.current = index;
        startMove(index, e.clientX, e.clientY);
        nodeStates.current[index].node.radius = nodeStates.current[index].node.radius * 1.5;
        document.addEventListener("mousemove", dragState.onMouseMoveCallback, false);
        document.addEventListener("mouseup", dragState.onMouseUpCallback, false);
        return false;
    }

    const setMovableGraphNode = (index: number) => {
        //Do nothing if the ref is null
        if (nodes.current[index] !== undefined) {
            nodes.current[index].onmousedown = (event) => moveNodeOnMouseDown(event, index);
        } else{
            return;
        } 
    }


    useEffect(() => {
        if (graphSVGRef.current === null) {
            return;
        }
        //Set correct width and height once graphsvg has been found
        let svgDimensions = graphSVGRef.current.getBoundingClientRect();
        setSvgWidth(svgDimensions.width);
        setSvgHeight(svgDimensions.height);
        //Make the Graph Node Movable...will eventually take an index to indicate which node
        if (nodes.current) {
            for (let i = 0; i < nodes.current.length; i++) {
                setMovableGraphNode(i);
            }
        }
        if (edge.current !== null) {
            const nodeIds = edge.current.id.split(".");
            let n1: number = parseInt(nodeIds[1]);
            let n2: number = parseInt(nodeIds[2]);

            if (edgeState.current)  {
                edgeState.current.nodeOne = nodeStates.current[n1].node;
                edgeState.current.nodeTwo = nodeStates.current[n2].node;
                edgeState.current.elm = edge.current;
                let x1 = Number(edge.current.getAttribute("x1"));
                let x2 = Number(edge.current.getAttribute("x2"));
                let y1 = Number(edge.current.getAttribute("y1"));
                let y2 = Number(edge.current.getAttribute("y2"));
                edgeState.current.x1 = x1
                edgeState.current.x2 = x2
                edgeState.current.y1 = y1
                edgeState.current.y2 = y2

                let lengthX = x2 - x1;
                let lengthY = y2 - y1;

                //a2 + b2 etc. Thought it was dot product, lol
                let c = Math.sqrt(lengthX * lengthX + lengthY * lengthY);
                if (c === 0.0) {
                    lengthX = 0.0;
                    lengthY = 0.0;
                } else {
                    //unit vector
                    lengthX = lengthX / c;
                    lengthY = lengthY /c;
                }

                lengthX = Math.abs (lengthX); lengthY = Math.abs (lengthY);
                if (edgeState.current.nodeOne.ix > edgeState.current.nodeTwo.ix) { 
                    lengthX *= -1.0; 
                }
                if (edgeState.current.nodeOne.iy > edgeState.current.nodeTwo.iy) { 
                    lengthY *= -1.0; 
                }

                let px = -lengthY;
                var py = lengthX;

                let tmpx, tmpy;
                // transform line endpoint coordinates (x1,y1) and (x2,y2) such that they are relative to the nodes when the line is horizontal (0 degrees)
                edgeState.current.x1 -= edgeState.current.nodeOne.x; 
                edgeState.current.y1 -= edgeState.current.nodeOne.y;
                tmpx = edgeState.current.x1 * lengthX + edgeState.current.y1 * lengthY; 
                tmpy = edgeState.current.x1 * px + edgeState.current.y1 * py; // projection of line vector on line unit vector and perp unit vector
                edgeState.current.x1 = tmpx; 
                edgeState.current.y1 = tmpy;
                edgeState.current.x2 -= edgeState.current.nodeTwo.x; 
                edgeState.current.y2 -= edgeState.current.nodeTwo.y;
                tmpx = edgeState.current.x2 * lengthX + edgeState.current.y2 * lengthY; 
                tmpy = edgeState.current.x2 * px + edgeState.current.y2 * py; // projection of line vector on line unit vector and perp unit vector
                edgeState.current.x2 = tmpx; 
                edgeState.current.y2 = tmpy;

                //Push the new edge state to links
                nodeStates.current[n1].node.links.push(edgeState.current);
                nodeStates.current[n2].node.links.push(edgeState.current);

            }
        }
        
        //TODO: Possible remove edge from dependency lsit
    }, [graphSVGRef, nodes, edge])


    return (
        <div>
            <svg 
                ref={graphSVGRef} 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink={"http://www.w3.org/1999/xlink"} 
                className="notselectable nwlinkhovertoggle" 
                height="900" id="svg_network_image" width={width} style={{verticalAlign: "top"}}>
                <g id="edges">
                    <g xmlns="http://www.w3.org/2000/svg" className="nwlinkwrapper" id="edge.0.1">
                        <line xmlns="http://www.w3.org/2000/svg" 
                            ref={edge}
                            className="nw_edge" 
                            id="line.17069343.17074188.0" 
                            stroke="rgb(0,0,200)" 
                            strokeOpacity="0" strokeWidth={"13"} x1="381" x2="480" y1="98" y2="207"/>
                    </g>
                </g>
                <g id="nodes">
                    <defs>
                        <filter id="filter_shadow">
                            <feGaussianBlur stdDeviation="1"/>
                        </filter>
                    </defs>
                    <defs>
                        <filter height="200%" id="filter_bg_text" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="1.8"/>
                        </filter>
                    </defs>

                    <GraphNode nodeId={0}startX={200} startY={200} radius={nodeStates.current[0].node.radius} ref={(ref) => {
                        if (ref !== null) {
                            nodes.current.push(ref)}
                        }
                    } />
                    <GraphNode nodeId={1}startX={600} startY={600} radius={nodeStates.current[1].node.radius} ref={(ref) => {
                        if (ref !== null) {
                            nodes.current.push(ref)}
                        }
                    } />
                </g>
            </svg>     
        </div>
    );
}