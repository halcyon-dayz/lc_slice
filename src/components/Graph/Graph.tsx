import React, {useState, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"
import { MotionStyle } from "framer-motion"

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


type GraphNodeState = {
    hasMoved: boolean,
    isInFront: boolean,
    isBeingDragged: boolean,
    originalEventTarget: EventTarget | null,
    node: Node<any>,
    moveStartX: number,
    moveStartY: number,
    moveStartObject: XY,
    onMouseUpCallback: (this: any, event: MouseEvent) => any,
    onMouseMoveCallback: (this: any, event: MouseEvent) => any,
}


export const Graph = () => {

    const [svgWidth, setSvgWidth] = useImmer<number>(450.0);
    const [svgHeight, setSvgHeight] = useImmer<number>(450.0);

    //Ref of the entire graph
    const graphSVGRef = useRef<SVGSVGElement>(null);
    //Forwareded ref from GraphNodeObject
    const graphNodeRef = useRef<SVGGElement>(null);
    //We separate the state of the node from its reference, which might need to be changed in the future
    const [graphNodeState, updateGraphNodeState] = useImmer<GraphNodeState>({
        hasMoved : false,
        isInFront: false,
        isBeingDragged: false,
        originalEventTarget: null,
        moveStartX: 0,
        moveStartY: 0,
        moveStartObject: {
            x: 200,
            y: 200
        },
        node: {
            x: 200,
            y: 200,
            ix: 200,
            iy: 200,
            radius: 20,
            links: []
        },
        onMouseMoveCallback: (event: MouseEvent) => {
            updateGraphNodeState(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseMove(event);
        },
        onMouseUpCallback: (event: MouseEvent) => {
            updateGraphNodeState(state => {state.originalEventTarget = event.currentTarget});
            return moveNodeOnMouseUp(event);
        },
    })


    const startMove = (x: number, y: number) => {
        //Certain fields are not yet populated but will be when the callback is first called
        updateGraphNodeState(state => {state.moveStartX = x});
        updateGraphNodeState(state => {state.moveStartY = y});
        updateGraphNodeState(state => {state.moveStartObject.x = state.node.x});
        updateGraphNodeState(state => {state.moveStartObject.y = state.node.y});
        updateGraphNodeState(state => {state.hasMoved = false});
        updateGraphNodeState(state => {state.isInFront = false});
        updateGraphNodeState(state => {state.isBeingDragged = true});
        updateGraphNodeState(state => {state.originalEventTarget = null});
        /*updateGraphNodeState({
            hasMoved: false,
            isInFront: false,
            isBeingDragged: true,
            originalEventTarget: null,
            node: graphNodeState.node,
            onMouseMoveCallback: graphNodeState.onMouseMoveCallback,
            onMouseUpCallback: graphNodeState.onMouseUpCallback
        }) */
    }

    const moveNodeOnMouseMove = (e: MouseEvent) => {
        console.log("Mouse move on node")
        //If mouse down has not been set
        if (graphNodeState.isBeingDragged === false) {
            return false;
        }

        //Set svgWidth if it has not yet been set
        if ((svgWidth === 0 || svgHeight === 0) && graphSVGRef.current !== null) {
            setSvgWidth(state => {return graphSVGRef.current ? graphSVGRef.current.getBoundingClientRect().width : state})
            setSvgHeight(state => {return graphSVGRef.current ? graphSVGRef.current.getBoundingClientRect().height : state})
        }

        //Get new mouse coordinates
        const newMouseX = e.clientX;
        const newMouseY = e.clientY;
        updateGraphNodeState(state => {state.originalEventTarget = null});

        //If the mouse has moved from its starting position at mouse down
        if (newMouseX !== graphNodeState.moveStartX || newMouseY !== graphNodeState.moveStartY) {
            //Indicate that the mouse has indeed moved
            updateGraphNodeState(state => {state.hasMoved = true})
        }
        //Create new values first since setState/Immer will not update synchronously
        //However, our ref will need to be updated synchronously
        let newNodePosX = 
            graphNodeState.moveStartObject.x + 
            newMouseX - 
            graphNodeState.moveStartX
        ;

        let newNodePosY = 
            graphNodeState.moveStartObject.y + 
            newMouseY - 
            graphNodeState.moveStartY
        ;

        let nodeRadius = graphNodeState.node.radius;


        //Move the node to where the node object lay + (new position of mouse - where the mouse started)
        updateGraphNodeState(state => {state.node.x = newNodePosX});
        updateGraphNodeState(state => {state.node.y = newNodePosY});

        //If the new position of the node goes off screen left
        if (graphNodeState.node.x < nodeRadius / 2.0) {
            newNodePosX = nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.x = newNodePosX});
        //Else if it goes off screen right
        } else if (graphNodeState.node.x + nodeRadius / 2.0 > svgWidth) {
            newNodePosX = svgWidth - nodeRadius / 2.0;
            updateGraphNodeState(state => {state.node.x = newNodePosX});
        }

        //If the new position of the node goes off screen top
        if (graphNodeState.node.y < nodeRadius / 2.0) {
            newNodePosY = nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.y = newNodePosY});
        //Else if it goes off screen bottom
        } else if (graphNodeState.node.y + nodeRadius / 2.0 > svgHeight) {
            newNodePosY = svgHeight - nodeRadius / 2.0
            updateGraphNodeState(state => {state.node.y = newNodePosY});
        }

        //TODO: 
        //Finally after the position has been fully updated, update the ref
        let prevIX = graphNodeState.node.ix;
        let prevIY = graphNodeState.node.iy;
        let x = newNodePosX - prevIX;
        let y = newNodePosY - prevIY;
        graphNodeRef.current?.setAttribute("transform", "translate(" + (x) + "," + (y) + ")")
        return false;
    }

    const moveNodeOnMouseUp = (e: MouseEvent) => {
        console.log("Mouse up on node")
        //Node is no longer being dragged
        updateGraphNodeState(state => {state.isBeingDragged = false});
        //Document should no longer be listening for any changes in the node's position
        document.removeEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.removeEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
        return false;
    }

    //TODO: Mouse Event or React.MouseEvent
    const moveNodeOnMouseDown = (e: MouseEvent) => {
        console.log("Mouse down on node")
        startMove(e.clientX, e.clientY);
        //When we add false to addEventListener, we can designate whether
        //we capture it at the beginning or the end ("bubble")
        //if useCapture is set to true, then events are dispatched from the root of tree
        //to the target node
        //if false, events are dispatched from the node to the tree root
        //I suppose in this case, we want events to propogate from a click of a node element
        //to the document?
        //I.E We handle innermost event of node, before we handle document event
        graphNodeRef.current?.addEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.addEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.addEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
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
            /*updateGraphNodeState(state => {
                state.onMouseMoveCallback = (event: MouseEvent) => {
                    updateGraphNodeState(state => state.originalEventTarget = event.currentTarget);
                    return moveNodeOnMouseMove(event);
                }
            })
            updateGraphNodeState(state => {
                state.onMouseUpCallback = (event: MouseEvent) => {
                    updateGraphNodeState(state => state.originalEventTarget = event.currentTarget);
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
        if (graphNodeRef.current) {
            setMovableGraphNode()
        }
        
    }, [graphSVGRef, graphNodeRef])


    return (
        <div>
            <svg ref={graphSVGRef} xmlns="http://www.w3.org/2000/svg" xmlnsXlink={"http://www.w3.org/1999/xlink"} className="notselectable nwlinkhovertoggle" height="422" id="svg_network_image" width="976" style={{verticalAlign: "top"}}>
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

                    <GraphNode startX={graphNodeState.node.x} startY={graphNodeState.node.y} radius={20} ref={graphNodeRef} />
                </g>
            </svg>     
        </div>
    );
}