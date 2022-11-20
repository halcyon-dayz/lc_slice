import React, {useState, useEffect, useRef} from "react"
import {GraphNode} from "./GraphNode"
import {useImmer} from "use-immer"

type XY = {
    x: number,
    y: number
}

//Needed for edges as I understand it
type XYRadius = {
    x: number,
    y: number, 
    radius: number
}


type GraphNodeState = {
    hasMoved: boolean,
    isInFront: boolean,
    isBeingDragged: boolean,
    originalEventTarget: any,
    node: XYRadius,
    moveStartX: number,
    moveStartY: number,
    moveStartObject: XY,
    onMouseUpCallback: (this: Document, event: MouseEvent) => any,
    onMouseMoveCallback: (this: Document, event: MouseEvent) => any,
}


export const Graph = () => {

    const [svgWidth, setSvgWidth] = useState<number>(450.0);
    const [svgHeight, setSvgHeight] = useState<number>(450.0);

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
            x: 0,
            y: 0,
            radius: 0
        },
        //Wh
        onMouseUpCallback: function(this: Document, event: MouseEvent) {
        },
        onMouseMoveCallback: function(this: Document, event: MouseEvent) {

        }
    })

    const [graphDimensions, setGraphDimensions] = useState([0, 0]);

    const startMove = (x: number, y: number) => {
        //Certain fields are not yet populated but will be when the callback is first called
        updateGraphNodeState({
            //Mouse Start
            moveStartX: x,
            moveStartY: y,
            //Obeject start. i.e the actual x and y of the elemnt itself
            moveStartObject: {x: graphNodeState.node.x, y: graphNodeState.node.y},
            hasMoved: false,
            isInFront: false,
            isBeingDragged: true,
            originalEventTarget: null,
            node: graphNodeState.node,
            onMouseMoveCallback: graphNodeState.onMouseMoveCallback,
            onMouseUpCallback: graphNodeState.onMouseUpCallback
        })
    }

    const moveNodeOnMouseMove = (e: MouseEvent) => {
        //If mouse down has not been set
        if (graphNodeState.isBeingDragged === false) {
            return false;
        }

        //Do something for is in front

        //Set svgWidth if it has not yet been set
        if ((svgWidth === 0 || svgHeight === 0) && graphSVGRef.current !== null) {
            setSvgWidth(graphSVGRef.current.getBoundingClientRect().width)
            setSvgHeight(graphSVGRef.current.getBoundingClientRect().height)
        }

        //Get new mouse coordinates
        const newX = e.clientX;
        const newY = e.clientY;
        updateGraphNodeState(state => state.originalEventTarget = null);

        //If the mouse has moved from its starting position at mouse down
        if (newX !== graphNodeState.moveStartX || newY !== graphNodeState.moveStartY) {
            //Indicate that the mouse has indeed moved
            updateGraphNodeState(state => state.hasMoved = true)
        }
    }

    const moveNodeOnMouseUp = (e: MouseEvent) => {
        //Node is no longer being dragged
        updateGraphNodeState(state => state.isBeingDragged = false);
        //Document should no longer be listening for any changes in the node's position
        document.removeEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.removeEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
        return false;
    }

    //TODO: Mouse Event or React.MouseEvent
    const moveNodeOnMouseDown = (e: MouseEvent) => {
        startMove(e.clientX, e.clientY);
        //When we add false to addEventListener, we can designate whether
        //we capture it at the beginning or the end ("bubble")
        //if useCapture is set to true, then events are dispatched from the root of tree
        //to the target node
        //if false, events are dispatched from the node to the tree root
        //I suppose in this case, we want events to propogate from a click of a node element
        //to the document?
        //I.E We handle innermost event of node, before we handle document event
        document.addEventListener("mousemove", graphNodeState.onMouseMoveCallback, false);
        document.addEventListener("mouseup", graphNodeState.onMouseUpCallback, false);
        return false;
    }

    const setMovableGraphNode = () => {
        //Do nothing if the ref is null
        if (graphNodeRef.current !== null) {
            graphNodeRef.current.data-x
            //Node has not yet moved
            updateGraphNodeState(state => state.hasMoved = false);
            //Node is not in front of other nodes
            updateGraphNodeState(state => state.isInFront);
            //Node is not being dragged
            updateGraphNodeState(state => state.isBeingDragged);
            //Node does not yet have an event target location
            updateGraphNodeState(state => state.originalEventTarget = null)
            //NOTE ABOUT HANDLERS
            //ref.onmousedown will reset all handlers associated with onmousedown
            //addEventListener allows you to add multiple onmousedown handler
            //Note if onmousedown has more than one handler so we can refactor accordingly
            graphNodeRef.current.onmousedown = moveNodeOnMouseDown
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
        setMovableGraphNode()
        graphNodeRef.current?.addEventListener("click", () => console.log("yo"))

    }, [graphSVGRef])


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

                    <GraphNode startX={200} startY={200} ref={graphNodeRef} />
                </g>
            </svg>     
        </div>
    );
}