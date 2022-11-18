import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {changeGridCell} from "../../features/grids/gridsSlice";
import {RootState} from "../../utils/types"
import "./node.css"
import {motion} from "framer-motion"


type NodeProps = {
    rowIdx: number,
    colIdx: number,
    styleWidth: number,
    styleHeight: number,
    gridIndex: number
}

const onlyNumbers = (str: string) => {
    return /^-?\d*\.{0,1}\d+$/.test(str);
    //return /^[0-9.,]+$/.test(str);
}

const onlyBooleans = (str: string) => {
    if (str.includes("true") || str.includes("false")) {
        return true;
    }
    return false;
}

const parseBoolean = (str: string) => {
    const trueCheck = str.includes("true");
    const falseCheck = str.includes("false");
    if (trueCheck && falseCheck) {
        return true;
    }
    if (falseCheck) {
        return false;
    }
    if (trueCheck) {
        return true;
    }

}

const parseCellData = (data: any) => {
    console.log(data);
    console.log("parsing cell data");
    if (data === true || data === false) {
        if (data === true) {
            return "true";
        }
        if (data === "false") {
            return "false";
        }
    }
    return data;
}

export const Node = ({gridIndex, rowIdx, colIdx, styleWidth, styleHeight}: NodeProps) => {
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
        if (onlyNumbers(value)) {
            const num = parseInt(value);
            dispatch(changeGridCell({gridIndex: 0, row: rowIdx, col: colIdx, data: num, status: cellStatus}));
            return;
        }
        if (onlyBooleans(value)) {
            const val = parseBoolean(value);
            dispatch(changeGridCell({gridIndex: 0, row: rowIdx, col: colIdx, data: val, status: cellStatus}));
            
        }
        
    }


    //TODO: It can't be explored and current at the same time
                //We need to differentiate between status and visual updates
                // at some point.
                //TOOD: Ideally status is only for visual updates, and real status is inferred
                //from the data in the cells. Semantic issue with current naming scheme

    const variants = {
        normal: {width: 50, height: 50},
        change: {width: `${styleWidth}px`, height: `${styleHeight}px`}
    }
    
    useEffect(() => {



    }, [styleWidth, styleHeight])

    return (
        <motion.div
            initial="normal"
            animate="change"
            variants={variants}
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
            {cellData.toString()}
        </motion.div>
    )
}
