import React, {useState} from "react"
import { useAppSelector } from "../../features/hooks"
import {GridDS} from "../../utils/types"
import {Node} from "../Node"


type GridProps = {
    gridIndex: number

}

export const Grid = ({gridIndex}: GridProps) => {

    const grid = useAppSelector(state => state.grids[gridIndex]);
    return (
        <div className="grid" style={{marginBottom: "20px"}}>
            {grid.label}
            {grid.cells.map((row, rowIdx) => (
                <div key={`Grid_${gridIndex}_Row_${rowIdx}`}>
                    {row.map((node, nodeIdx) => (
                        <Node 
                            gridIndex={gridIndex}
                            key={`Grid_${gridIndex}_Cell_${rowIdx}_${nodeIdx}`}
                            rowIdx={rowIdx}
                            colIdx={nodeIdx}
                            styleWidth={grid.cellStyleWidth}
                            styleHeight={grid.cellStyleHeight}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}