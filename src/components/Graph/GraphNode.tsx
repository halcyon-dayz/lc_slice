import React from "react"


export type GraphNodeProps = {
    startX: number,
    startY: number,
    radius: number,
}

export const GraphNode = React.forwardRef<SVGGElement, GraphNodeProps>((props, ref) => {
    const {startX, startY, radius} = props;

    return (
        <g ref={ref} className="nwnodecontainer" data-action_option="add" data-exp_height="250" data-exp_width="324" data-radius={radius.toString()} data-safe_div_label="desF" data-x_pos={startX.toString()} data-y_pos={startY.toString()} id="node.17074189">
            <ellipse cx="586" cy="313" fill="#000000" filter="url(#filter_shadow)" opacity="0.6" rx="19" ry="14"/>
            <circle cx="586" cy="304" fill="url(#bubble_gradient1)" r="20"/>
            <circle cx="586" cy="304" fill="url(#bubble_gradient2)" opacity="0.33" r="20"/>
            <circle className="nwbubblecoloredcircle" cx="586" cy="304" fill="rgb(255,193,101)" r="20"/>
            <ellipse cx="586" cy="292" fill="url(#brilliance_gradient)" rx="11.5" ry="6"/>
            <text fill="rgb(247,246,242)" filter="url(#filter_bg_text)" opacity="1.0" stroke="rgb(247,246,242)" stroke-width="5" text-anchor="start" x="604" y="286">desF</text>
            <text fill="rgb(0,0,0)" opacity="1.0" text-anchor="start" x="604" y="286">desF</text>
        </g>
    );
})