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
    return /^-?\d*\.{0,1}\d+$/.test(str);
    //return /^[0-9.,]+$/.test(str);
}

export const Node = ({gridIndex, rowIdx, colIdx, styleWidth}: NodeProps) => {
    //TODO: Select individual cells
    const [stateIndex, setStateIndex] = useState<number>(0);
    const cellData = useSelector((state: RootState) => state.grids[gridIndex].cells[rowIdx][colIdx].data);
    const cellStatus = useSelector((state: RootState) => state.grids[gridIndex].cells[rowIdx][colIdx].status);
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
        dispatch(changeGridCell({gridIndex: 0, row: rowIdx, col: colIdx, data: num, status: cellStatus}))
    }

    return (
        <div
            className={
                cellStatus === 'START' ? "node_start" : 
                cellStatus === "END" ? "node_end" : 
                cellStatus === "EXPLORED" ? "node_explored" :
                cellStatus === "WATER" ? "node_water" :
                cellStatus === "ISLAND" ? "node_island" :
                cellStatus === "DEEP_OCEAN" ? "node_deep_ocean" :
                cellStatus === "MONKEY_ISLAND" ? "node_monkey_island" :
                cellStatus === "CURRENT" ? "node_current" :
                cellStatus === "PREV_EVALUATE" ? "node_prev_evaluate" :
                "node"
            } 
            contentEditable={true}
            onInput={onEditData}
            suppressContentEditableWarning={true}
        >
            {cellData}
        </div>
    )
}
