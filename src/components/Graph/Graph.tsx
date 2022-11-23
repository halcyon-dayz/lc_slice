import React, {useCallback, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"


type GraphNodeStateDeclarativeType= {
    hasMoved: boolean,
    isInFront: boolean,
    isBeingDragged: boolean,
    originalEventTarget: EventTarget | null,
    onMouseUpCallback: (this: any, event: MouseEvent) => any,
    onMouseMoveCallback: (this: any, event: MouseEvent) => any,
}

type XY = {
    x: number,
    y: number
}

const RotatePolygon = (angle: number, points: XY[]): XY[] => {
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);

    let newPoints: XY[] = [];
    
    for (let i = 0; i < points.length; i++) {
        let new_x = points[i].x * cosAngle - points[i].y * sinAngle;
        let new_y = points[i].x * sinAngle + points[i].y * cosAngle;
        newPoints[i] = {x: new_x, y: new_y};
    }
    return newPoints;
}

const TranslatePolygon = (x: number, y: number, points: XY[]): XY[] => {
    let newPoints: XY[] = [];
    for (let i = 0; i < points.length; i++) {
        let new_x = points[i].x + x;
        let new_y = points[i].y + y;
        newPoints[i] = {x: new_x, y: new_y}
    }
    return newPoints;
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
    n1Idx: number,
    n2Idx: number,
    edgeIdx: number,
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
    node: NodeType
}



export type GraphProps = {
    width: number,
}

export const Graph = ({width}: GraphProps) => {

    const selectedNode = useRef<number>(0);

    const edges = useRef<SVGLineElement[]>([]);

    const arrowRef = useRef<SVGPolygonElement>(null);
    const arrowState = useRef({
        mesh: [
            {
                x: 0,
                y: -50
            },
            {
                x: -50,
                y: 50,
            },
            {
                x: 50,
                y: 50,
            },
        ],
        points: [
            {
                x: 0,
                y: -50
            },
            {
                x: -50,
                y: 50,
            },
            {
                x: 50,
                y: 50,
            },
        ]
    })

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
                x: 600,
                y: 600, 
                ix: 600,
                iy: 600,
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

        //Account for the node's initial position before applying a translation
        let prevIX = nodeStates.current[curNode].node.ix
        let prevIY = nodeStates.current[curNode].node.iy
        let x = newNodePosX - prevIX;
        let y = newNodePosY - prevIY;
        nodes.current[curNode].setAttribute("transform", "translate(" + (x) + "," + (y) + ")")

        //Now modify the edges between nodes

        for (let i = 0; i < nodeStates.current[curNode].node.links.length; i++) {
            //Get the indexes of the nodes referred to in the current link of the current node
            let n1 = nodeStates.current[curNode].node.links[i].n1Idx;
            let n2 = nodeStates.current[curNode].node.links[i].n2Idx;
            let edgeIndex = nodeStates.current[curNode].node.links[i].edgeIdx;

            /*let x1 = nodeStates.current[curNode].node.links[i].x1;
            let x2 = nodeStates.current[curNode].node.links[i].x2;
            let y1 = nodeStates.current[curNode].node.links[i].y1;
            let y2 = nodeStates.current[curNode].node.links[i].y2; */

            //Get the affected nodes
            let nodeOne = nodeStates.current[n1].node;
            let nodeTwo = nodeStates.current[n2].node;
            //Get their current positions
            let x1 = nodeStates.current[n1].node.x;
            let x2 = nodeStates.current[n2].node.x;
            let y1 = nodeStates.current[n1].node.y;
            let y2 = nodeStates.current[n2].node.y;

            //Get new x and y lengths
            let lengthX = nodeTwo.x - nodeOne.x;
            let lengthY = nodeTwo.y - nodeOne.y;
            let c = (lengthX * lengthX + lengthY * lengthY);
            if (c === 0.0) {
                lengthX = 0.0; lengthY = 0.0;
            } else {
                lengthX = lengthX / c;
                lengthY = lengthY / c;
            }
            

            let px = -lengthY;
            let py = lengthX;

            //The node positions won't be updated dynamically
            if (edges.current[edgeIndex]) {
                //Set edge position to Node1 position + unitVector * old position
                let newX1 = nodeOne.x + lengthX * x1 + px * y1;
                let newY1 = nodeOne.y + lengthY * x1 + py * y1;
                let newX2 = nodeTwo.x + lengthX * x2 + px * y2;
                let newY2 = nodeTwo.y + lengthY * x2 + py * y2;
                console.log("X1, Y1, X2, Y2");
                console.log(newX1, newY1, newX2, newY2);
                nodeStates.current[curNode].node.links[i].x1 = newX1;
                nodeStates.current[curNode].node.links[i].x2 = newX2;
                nodeStates.current[curNode].node.links[i].y1 = newY1;
                nodeStates.current[curNode].node.links[i].y2 = newY2;
                edges.current[edgeIndex].setAttribute("x1", (newX1).toString());
                edges.current[edgeIndex].setAttribute("y1", (newY1).toString());
                edges.current[edgeIndex].setAttribute("x2", (newX2).toString());
                edges.current[edgeIndex].setAttribute("y2", (newY2).toString());
            }

            if (arrowRef.current) {
                let meshRotated = RotatePolygon(0.1, arrowState.current.mesh);
                arrowState.current.mesh = meshRotated;
                let meshTranslated = TranslatePolygon(100, 400, meshRotated);
                arrowState.current.points = meshTranslated;
            }

        }
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
        //Make the Graph Node Movable...will eventually take an index to indicate which node
        if (nodes.current) {
            for (let i = 0; i < nodes.current.length; i++) {
                setMovableGraphNode(i);
            }
        }

        if (edges.current && nodeStates.current) {
            for (let i = 0; i < edges.current.length; i++) {
                const nodeIds = edges.current[i].id.split(".");
                //Get the indexes of the nodes connected by the edge
                let n1: number = parseInt(nodeIds[1]);
                let n2: number = parseInt(nodeIds[2]);
                let x1 = Number(edges.current[i].getAttribute("x1"));
                let x2 = Number(edges.current[i].getAttribute("x2"));
                let y1 = Number(edges.current[i].getAttribute("y1"));
                let y2 = Number(edges.current[i].getAttribute("y2"));
                //Assign current values to edgeState
                let edgeState: EdgeImperativeType = {
                    n1Idx: n1,
                    n2Idx: n2,
                    edgeIdx: i,
                    x1: x1,
                    x2: x2,
                    y1: y1, 
                    y2: y2,
                }

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

                //If the first node is after the second node, negate the length
                lengthX = Math.abs (lengthX); lengthY = Math.abs (lengthY);
                if (nodeStates.current[n1].node.ix > nodeStates.current[n2].node.ix) { 
                    lengthX *= -1.0; 
                }
                if (nodeStates.current[n1].node.iy > nodeStates.current[n2].node.iy) { 
                    lengthY *= -1.0; 
                }

                let px = -lengthY;
                var py = lengthX;

                let tmpx, tmpy;
                // transform line endpoint coordinates (x1,y1) and (x2,y2) such that they are relative to the nodes when the line is horizontal (0 degrees)
                edgeState.x1 -= nodeStates.current[n1].node.x;
                edgeState.y1 -= nodeStates.current[n1].node.y;
                tmpx = edgeState.x1 * lengthX + edgeState.y1 * lengthY; 
                tmpy = edgeState.x1 * px + edgeState.y1 * py; // projection of line vector on line unit vector and perp unit vector
                edgeState.x1 = tmpx; 
                edgeState.y1 = tmpy;
                edgeState.x2 -= nodeStates.current[n2].node.x;
                edgeState.y2 -= nodeStates.current[n2].node.y;
                tmpx = edgeState.x2 * lengthX + edgeState.y2 * lengthY; 
                tmpy = edgeState.x2 * px + edgeState.y2 * py; // projection of line vector on line unit vector and perp unit vector
                edgeState.x2 = tmpx; 
                edgeState.y2 = tmpy;

                //Do something with arrow, obviously need to do matrix math here
                let halfX = 0.5 * (edgeState.x2 - edgeState.x1);
                let halfY = 0.5 * (edgeState.y2 - edgeState.y1);

                //Push the new edge state to links
                nodeStates.current[n1].node.links.push(edgeState);
                nodeStates.current[n2].node.links.push(edgeState);
            }
        }
        
        //TODO: Possible remove edge from dependency lsit
    }, [graphSVGRef, nodes, edges, arrowRef])


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
                            ref={(ref) => {
                                if (ref !== null) {
                                    edges.current.push(ref)
                                }
                            }}
                            className="nw_edge" 
                            id="line.0.1.0" 
                            stroke="rgb(0,0,200)" 
                            strokeOpacity="1" strokeWidth={"5"} x1="200" x2="600" y1="200" y2="600"/>
                            <polygon ref={arrowRef} points={arrowState.current.points.map( ({x, y}) => `${x},${y}`).join(" ")}/>
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