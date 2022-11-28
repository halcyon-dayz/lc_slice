import React from "react"
import {motion} from "framer-motion"


export type GraphNodeProps = {
    startX: number,
    startY: number,
    radius: number,
    nodeId: number
}

export const GraphNode = React.forwardRef<SVGGElement, GraphNodeProps>((props, ref) => {
    const {startX, startY, radius, nodeId} = props;

    //586, 304 + 9
    return (
        <g  ref={ref} className="graph_node" data-action_option="add" data-exp_height="250" data-exp_width="324" data-radius={radius.toString()} data-safe_div_label="desF" data-x_pos={startX.toString()} data-y_pos={startY.toString()} id={`node.${nodeId}`}>
            <ellipse cx={startX.toString()} cy={(startY + 9).toString()} fill="#000000" filter="url(#filter_shadow)" opacity="0.6" rx={(radius - 1).toString()} ry={(radius - 6).toString()}/>
            <circle cx={startX.toString()} cy={startY.toString()} fill="url(#bubble_gradient1)" r={radius.toString()}/>
            {/*<circle cx={startX.toString()} cy={startY.toString()} fill="url(#bubble_gradient2)" opacity="0.33" r={radius.toString()}/> */}
            <circle className="nwbubblecoloredcircle" cx={startX.toString()} cy={startY.toString()} fill="rgb(255,255,255)" r={radius.toString()}/>
            <ellipse cx={startX.toString()} cy={(startY - 12).toString()} fill="url(#brilliance_gradient)" rx="31.5" ry="20"/>
            <text fill="rgb(0,0,0)" opacity="1.0" textAnchor="start" x={
                (startX - 18).toString()
            } y={
                (startY + 5).toString() 
            }>Hello</text>
        </g>
    );
})