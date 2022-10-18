import React, {useState} from "react";
import { Cell, CellStatus } from "../../types";
import { NodeContainer } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { gridSelector, changeCell, gridCellsSelector} from "../../features/grid/gridSlice";
import {RootState} from "../../types"
import "./node.css"


type NodeProps = {
    rowIdx: number,
    colIdx: number,
    styleWidth: number
}

export const Node = ({rowIdx, colIdx, styleWidth}: NodeProps) => {
    //TODO: Select individual cells
    const [stateIndex, setStateIndex] = useState<number>(0);
    const cell = useSelector((state: RootState) => state.grid.cells[rowIdx][colIdx])
    const dispatch = useDispatch();

    //TODO: Change example dispatch
    const onClickNode = (e: React.MouseEvent) => {
        if (e.nativeEvent.button === 0) {
            dispatch(changeCell({row: rowIdx, col: colIdx, data: cell.data, status: "START"}));
        }
    }

    return (
        <div 
            className={
                cell.status === 'START' ? "node_start" : cell.status === "END" ? "node_end" : "node"
            } 
            onClick={onClickNode} 
            onContextMenu={onClickNode}
        >
            {cell.data}
        </div>
    )
}
