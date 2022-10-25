import React from "react"
import { Cell } from "../../utils/types"
import {ArrayNode} from "../Node"



type PointedArrayProps = {
    pointerLocations: number[]
    cells: Cell[],
}

export const PointedArray = ({pointerLocations, cells}: PointedArrayProps) => {

    //const numPointers = pointerLocations.length;

    return (
        <div style={{marginBottom: "20px", width: `${cells.length * 50}px`}}>
            {pointerLocations.map((pointer, idx) => (
                <div style={{
                    width: "20px", 
                    height: "15px", 
                    marginBottom: "10px",
                    marginLeft: "10px",
                    position: "relative",
                    left: `${100 / cells.length * pointer}%`
                }}>
                    {`p${idx + 1}`}
                </div>
            ))}
            {cells.map((cell, idx) => (
                <ArrayNode 
                    status={cell.status}
                    data={cell.data}
                    key={`Array_Cell_${idx}`}
                    rowIdx={0}
                    colIdx={idx}
                    styleWidth={50}
                />
            ))}  
        </div>
    )
}