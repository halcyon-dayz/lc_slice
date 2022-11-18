import React, {useState} from "react"
import { useAppSelector } from "../../features/hooks"
import {Node} from "../Node"
import "./grid.css"
import {motion} from "framer-motion"


type GridProps = {
    gridIndex: number

}

export const Grid = ({gridIndex}: GridProps) => {
    const gridCells = useAppSelector(state => state.grids[gridIndex].cells);
    const gridLabel = useAppSelector(state => state.grids[gridIndex].label);
    const cellWidth = useAppSelector(state => state.grids[gridIndex].cellStyleWidth);
    const cellHeight = useAppSelector(state => state.grids[gridIndex].cellStyleHeight);

    return (
        <div className="grid" style={{marginBottom: "20px"}}>
            {gridLabel}
            {gridCells.map((row, rowIdx) => (
                <div key={`Grid_${gridIndex}_Row_${rowIdx}`}>
                    {row.map((node, nodeIdx) => (
                        <Node 
                            gridIndex={gridIndex}
                            key={`Grid_${gridIndex}_Cell_${rowIdx}_${nodeIdx}`}
                            rowIdx={rowIdx}
                            colIdx={nodeIdx}
                            styleWidth={cellWidth}
                            styleHeight={cellHeight}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}