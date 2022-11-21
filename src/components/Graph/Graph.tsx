import React, {useState, useCallback, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"
import { MotionStyle, motion} from "framer-motion"

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
        links: [],
    }
}

export type GraphProps = {
    width: number,
}

const parseTranslateString = (str: string) => {
    
    
}

export const Graph = ({width}: GraphProps) => {

    const [svgWidth, setSvgWidth] = useState<number>(width);
    const [svgHeight, setSvgHeight] = useState<number>(450.0);

    useEffect(() => {
        setSvgWidth(width);
    }, [width])

    //Ref of the entire graph
    const graphSVGRef = useRef<SVGSVGElement>(null);
    //Forwareded ref from GraphNodeObject
    const graphNodeRefs = useRef<SVGGElement[]>([]);
    //We separate the state of the node from its reference, which might need to be changed in the future
    const nodeImperativeRefs = useRef<nodeImperativeType[]>([{
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
    const [nodeDeclarative, updateNodeDeclarative] = useImmer<GraphNodeStateDeclarativeType>({
        hasMoved : false,
        isInFront: false,
        isBeingDragged: false,
        originalEventTarget: null,
        onMouseMoveCallback: (event: MouseEvent) => {
            updateNodeDeclarative(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseMove(event);
        },
        onMouseUpCallback: (event: MouseEvent) => {
            updateNodeDeclarative(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseUp(event);
        },
    })


    const startMove = (x: number, y: number) => {
        //Certain fields are not yet populated but will be when the callback is first called
        console.log("startMove");
        console.log(x, y);
        nodeImperative.current.mouseStart.x = x;
        nodeImperative.current.mouseStart.y = y;
        nodeImperative.current.nodeStart.x = nodeImperative.current.node.x;
        nodeImperative.current.nodeStart.y = nodeImperative.current.node.y;
        updateNodeDeclarative(state => {state.hasMoved = false});
        updateNodeDeclarative(state => {state.isInFront = false});
        updateNodeDeclarative(state => {state.isBeingDragged = true});
        updateNodeDeclarative(state => {state.originalEventTarget = null});
    }

    const moveNodeOnMouseMove = useCallback( (e: MouseEvent) => {
        console.log("Mouse move on node")
        updateNodeDeclarative(state => {
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
        updateNodeDeclarative(state => {state.originalEventTarget = null});

        //If the mouse has moved from its starting position at mouse down
        if (
            newMouseX !== nodeImperative.current.mouseStart.x || 
            newMouseY !== nodeImperative.current.mouseStart.y) {
            //Indicate that the mouse has indeed moved
            updateNodeDeclarative(state => {state.hasMoved = true})
        }

        let currentSVGRect = graphSVGRef.current?.getBoundingClientRect();
        let currentSVGTopY = currentSVGRect?.top;
        let currentSVGLeftX = currentSVGRect?.left;

        //Where are the current svg coordinates
        console.log("SVG (X, Y) COORDS");
        console.log(currentSVGLeftX, currentSVGTopY);

        //Where did the mouse start
        console.log("Mouse starting coordinates");
        console.log(nodeImperative.current.mouseStart.x, nodeImperative.current.mouseStart.y);

        //Where is the mouse position
        console.log("Mouse (X, Y) COORDS");
        console.log(newMouseX, newMouseY)

        //Where did the move start on the node
        console.log("Object at start of move (x, y)");
        console.log(nodeImperative.current.nodeStart.x, nodeImperative.current.nodeStart.y)

        //Create new values first since setState/Immer will not update synchronously
        //However, our ref will need to be updated synchronously
        let newNodePosX = 
            //(currentSVGLeftX ? currentSVGLeftX : 0) +
            nodeImperative.current.nodeStart.x + 
            newMouseX - 
            nodeImperative.current.mouseStart.x
        ;


        console.log("New Node Position X:")
        console.log(newNodePosX);

        let newNodePosY = 
            //(currentSVGTopY ? currentSVGTopY : 0) +
            nodeImperative.current.nodeStart.y +
            newMouseY - 
            nodeImperative.current.mouseStart.y
        ;

        console.log("New Node Position Y:")
        console.log(newNodePosY);

        let nodeRadius = nodeImperative.current.node.radius;


        //Move the node to where the node object lay + (new position of mouse - where the mouse started)
        nodeImperative.current.node.x = newNodePosX;
        nodeImperative.current.node.y = newNodePosY;
        //If the new position of the node goes off screen left
        //TODO: GET RID OF COMMENTED OFF SCREEN EDGE CASES ONCE REGULAR DRAGGING IS WORKING PROPERLY
        /*if (nodeImperative.current.node.x < nodeRadius / 2.0) {
            console.log("off screen")
            newNodePosX = nodeRadius / 2.0
            nodeImperative.current.node.x = newNodePosX;
        //Else if it goes off screen right
        } else if (nodeImperative.current.node.x + nodeRadius / 2.0 > svgWidth) {
            console.log("off screen right")
            newNodePosX = svgWidth - nodeRadius / 2.0;
            updateNodeDeclarative(state => {state.node.x = newNodePosX});
        }

        //If the new position of the node goes off screen top
        if (graphNodeState.node.y < nodeRadius / 2.0) {
            newNodePosY = nodeRadius / 2.0
            updateNodeDeclarative(state => {state.node.y = newNodePosY});
        //Else if it goes off screen bottom
        } else if (graphNodeState.node.y + nodeRadius / 2.0 > svgHeight) {
            newNodePosY = svgHeight - nodeRadius / 2.0
            updateNodeDeclarative(state => {state.node.y = newNodePosY});
        } */

        //TODO: 
        //Finally after the position has been fully updated, update the ref
        let prevIX = nodeImperative.current.node.ix
        let prevIY = nodeImperative.current.node.iy
        console.log(prevIX);
        let x = newNodePosX - prevIX;
        let y = newNodePosY - prevIY;

        console.log("Translate (x, y)")
        console.log(x, y);
        graphNodeRef.current?.setAttribute("transform", "translate(" + (x) + "," + (y) + ")")
        return false;
    }, [width])

    const moveNodeOnMouseUp = (e: MouseEvent) => {
        console.log("Mouse up on node")
        //Node is no longer being dragged
        updateNodeDeclarative(state => {state.isBeingDragged = false});
        nodeImperative.current.node.radius = nodeImperative.current.node.radius / 1.5;;
        graphNodeRef.current?.getAttribute("transform");

        document.removeEventListener("mousemove", nodeDeclarative.onMouseMoveCallback, false);
        document.removeEventListener("mouseup", nodeDeclarative.onMouseUpCallback, false);
        return false;
    }

    //TODO: Mouse Event or React.MouseEvent
    const moveNodeOnMouseDown = (e: MouseEvent) => {
        console.log("Mouse down on node")
        startMove(e.clientX, e.clientY);
        nodeImperative.current.node.radius = nodeImperative.current.node.radius * 1.5;
        document.addEventListener("mousemove", nodeDeclarative.onMouseMoveCallback, false);
        document.addEventListener("mouseup", nodeDeclarative.onMouseUpCallback, false);
        return false;
    }

    const setMovableGraphNode = () => {
        //Do nothing if the ref is null
        if (graphNodeRef.current !== null) {
            //Node has not yet moved

            //NOTE ABOUT HANDLERS
            //ref.onmousedown will reset all handlers associated with onmousedown
            //addEventListener allows you to add multiple onmousedown handler
            //Note if onmousedown has more than one handler so we can refactor accordingly
            graphNodeRef.current.onmousedown = moveNodeOnMouseDown
            /*updateNodeDeclarative(state => {
                state.onMouseMoveCallback = (event: MouseEvent) => {
                    updateNodeDeclarative(state => state.originalEventTarget = event.currentTarget);
                    return moveNodeOnMouseMove(event);
                }
            })
            updateNodeDeclarative(state => {
                state.onMouseUpCallback = (event: MouseEvent) => {
                    updateNodeDeclarative(state => state.originalEventTarget = event.currentTarget);
                    return moveNodeOnMouseUp(event);
                }
            }) */
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
        if (graphNodeRefs.current) {
            setMovableGraphNode();
            graphNodeRef.current.addEventListener("click", () => {
                console.log("clicked");
            })
        }
        
    }, [graphSVGRef, graphNodeRef])


    return (
        <div>
            <svg 
                ref={graphSVGRef} 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink={"http://www.w3.org/1999/xlink"} 
                className="notselectable nwlinkhovertoggle" 
                height="900" id="svg_network_image" width={width} style={{verticalAlign: "top"}}>
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

                    <GraphNode startX={200} startY={200} radius={nodeImperative.current.node.radius} ref={graphNodeRef} />
                    <GraphNode startX={400} startY={400} radius={nodeImperative.current.node.radius} ref={se}
                </g>
            </svg>     
        </div>
    );
}