import React, {useState} from "react"
import {GridDS} from "../../utils/types"
import {Node} from "../Node"


type GridProps = {
    grid: GridDS
}

export const Grid = ({grid}: GridProps) => {
    return (
        <div className="grid" style={{marginBottom: "50px"}}>
            {grid.cells.map((row, rowIdx) => (
                <div key={`Cell_${rowIdx}`}>
                    {row.map((node, nodeIdx) => (
                        <Node 
                            key={`Cell_${rowIdx}_${nodeIdx}`}
                            rowIdx={rowIdx}
                            colIdx={nodeIdx}
                            styleWidth={grid.cellStyleWidth}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}