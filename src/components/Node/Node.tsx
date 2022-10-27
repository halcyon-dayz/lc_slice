import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {changeGridCell} from "../../features/grids/gridsSlice";
import {RootState} from "../../utils/types"
import "./node.css"


type NodeProps = {
    rowIdx: number,
    colIdx: number,
    styleWidth: number,
    gridIndex: number
}

const onlyNumbers = (str: string) => {
    return /^[0-9.,]+$/.test(str);
}

export const Node = ({gridIndex, rowIdx, colIdx, styleWidth}: NodeProps) => {
    //TODO: Select individual cells
    const [stateIndex, setStateIndex] = useState<number>(0);
    const cell = useSelector((state: RootState) => state.grids[gridIndex].cells[rowIdx][colIdx])
    const dispatch = useDispatch();

    //TODO: Change example dispatch
    /* const onClickNode = (e: React.MouseEvent) => {
        if (e.nativeEvent.button === 0) {
            dispatch(changeCell({row: rowIdx, col: colIdx, data: cell.data, status: "START"}));
        }
    } */

    const onEditData = (e: React.FormEvent) => {
        const value = e.currentTarget.textContent
        if (value === null) {
            return;
        }
        if (!onlyNumbers(value)) {
            return;
        }
        const num = parseInt(value);
        dispatch(changeGridCell({gridIndex: 0, row: rowIdx, col: colIdx, data: num, status: cell.status}))
    }

    return (
        <div
            className={
                cell.status === 'START' ? "node_start" : 
                cell.status === "END" ? "node_end" : 
                "node"
            } 
            contentEditable='true'
            onInput={onEditData}
        >
            {cell.data}
        </div>
    )
}
