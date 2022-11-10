import React from "react"
import { useSelector} from "react-redux"
import { useDispatch } from "react-redux";
import { 
    changeGridWidth, 
    changeGridHeight, 
    clearGridCells, 
    clearGridRow
} from "../../features/grids/gridsSlice";
import { selectAllGrids } from "../../features/grids/gridsSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {addArray, addGrid, deleteArray, deleteGrid} from "../../features/sharedActions"
import {RootState} from "../../utils/types"

type UtilitiesControllerType = {
    inputGrid: number,
    selectedRow: number,
    clearValue: number
}

export const UtilitiesController = ({inputGrid, selectedRow, clearValue}: UtilitiesControllerType) => {
    const grids = useSelector(selectAllGrids);
    const arraysLength = useAppSelector(state => state.arrays.length);
    const dispatch = useAppDispatch();

    const clickIncreaseRows = () => {
        dispatch(changeGridWidth({gridIndex: inputGrid, newWidth: grids[inputGrid].width + 1}))
    }

    const clickDecreaseRows = () => {
        if (grids[inputGrid].width - 1 >= 2) {
            dispatch(changeGridWidth({
                gridIndex: inputGrid, 
                newWidth: grids[inputGrid].width - 1
            }))
        }
    }

    const clickIncreaseColumns = () => {
        if (grids.length === 0) {
            return;
        }
        dispatch(changeGridHeight({
            gridIndex: inputGrid, 
            newHeight: grids[inputGrid].height + 1
        }))
    }

    const clickDecreaseColumns = () => {
        if (grids.length === 0) {
            return;
        }
        if (grids[inputGrid].height - 1 >= 2) {
            dispatch(changeGridHeight({gridIndex: inputGrid, newHeight: grids[inputGrid].height - 1}))
        }  
    }

    const clickAddGrid = () => {
        dispatch(addGrid({num: 1}));
    }

    const clickDeleteGrid = () => {
        dispatch(deleteGrid({num: 1, gridsLength: grids.length}))
    }

    const clickClearSelectedGrid = () => {
        if (grids.length === 0) {
            return;
        }
        dispatch(clearGridCells({gridIndex: inputGrid, defaultValue: 0}));
    }

    const clickClearSelectedRow = () => {
        if (grids.length === 0) {
            return;
        }
        dispatch(clearGridRow({
            gridIndex: inputGrid,
            row: selectedRow,
            data: clearValue,
            status: "UNEXPLORED"
        }))
    }

    const clickAddArray = () => {
        dispatch(addArray({num: 1}));
    }

    const clickDeleteArray = () => {
        dispatch(deleteArray({num: 1, arraysLength: arraysLength}));
    }

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickDecreaseRows()}>Remove Grid Width</button>
                <button onClick={() => clickIncreaseRows()}>Add Grid Width</button>
                <button onClick={() => clickDecreaseColumns()}>Remove Grid Height</button>
                <button onClick={() => clickIncreaseColumns()}>Add Grid Height</button>
            </div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickClearSelectedGrid()}>Clear Selected Grid</button>
                <button onClick={() => clickClearSelectedRow()}>Clear Selected Row</button>
            </div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickAddGrid()}>Add Grid</button>
                <button onClick={() => clickDeleteGrid()}>Delete Grid</button>
                <button onClick={() => clickAddArray()}>Add Array</button>
                <button onClick={() => clickDeleteArray()}>Delete Array</button>
            </div>
        </div>
    );
}