import React from "react"


export type GraphNodeProps = {
    startX: number,
    startY: number,
    radius: number,
}

export const GraphNode = React.forwardRef<SVGGElement, GraphNodeProps>((props, ref) => {
    const {startX, startY, radius} = props;

    //586, 304 + 9
    return (
        <g ref={ref} className="graph_node" data-action_option="add" data-exp_height="250" data-exp_width="324" data-radius={radius.toString()} data-safe_div_label="desF" data-x_pos={startX.toString()} data-y_pos={startY.toString()} id="node.17074189">
            <ellipse cx={startX.toString()} cy={(startY + 9).toString()} fill="#000000" filter="url(#filter_shadow)" opacity="0.6" rx="19" ry="14"/>
            <circle cx={startX.toString()} cy={startY.toString()} fill="url(#bubble_gradient1)" r={radius.toString()}/>
            <circle cx={startX.toString()} cy={startY.toString()} fill="url(#bubble_gradient2)" opacity="0.33" r={radius.toString()}/>
            <circle className="nwbubblecoloredcircle" cx={startX.toString()} cy={startY.toString()} fill="rgb(255,193,101)" r={radius.toString()}/>
            <ellipse cx={startX.toString()} cy={(startY - 12).toString()} fill="url(#brilliance_gradient)" rx="11.5" ry="6"/>
        </g>
    );
})