import React, {useState} from "react"
import { useAppSelector } from "../../features/hooks"
import {GridDS} from "../../utils/types"
import {Node} from "../Node"


type GridProps = {
    gridIndex: number

}

export const Grid = ({gridIndex}: GridProps) => {

    const grid = useAppSelector(state => state.grids[0]);
    console.log(grid.cells);

    return (
        <div className="grid" style={{marginBottom: "50px"}}>
            {grid.cells.map((row, rowIdx) => (
                <div key={`Grid_${gridIndex}_Row_${rowIdx}`}>
                    {row.map((node, nodeIdx) => (
                        <Node 
                            gridIndex={gridIndex}
                            key={`Grid_${gridIndex}_Cell_${rowIdx}_${nodeIdx}`}
                            rowIdx={rowIdx}
                            colIdx={nodeIdx}
                            styleWidth={50}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}