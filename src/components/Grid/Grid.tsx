import React, {useState} from "react"
import {GridStructureDisplay} from "../../types"
import {Node} from "../Node"


type GridProps = {
    grid: GridStructureDisplay
}

export const Grid = ({grid}: GridProps) => {
    return (
        <div className="grid" style={{marginBottom: "50px"}}>
            {grid.cells.map((row, rowIdx) => (
                <div>
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