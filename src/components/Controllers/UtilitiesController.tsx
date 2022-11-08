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
import { useAppDispatch } from "../../features/hooks";
import {addGrid, deleteGrid} from "../../features/sharedActions"


type UtilitiesControllerType = {
    inputGrid: number,
    selectedRow: number,
    clearValue: number
}

export const UtilitiesController = ({inputGrid, selectedRow, clearValue}: UtilitiesControllerType) => {
    const grids = useSelector(selectAllGrids);
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
        dispatch(deleteGrid({num: 1}))
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

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickDecreaseRows()}>Remove Width</button>
                <button onClick={() => clickIncreaseRows()}>Add Width</button>
                <button onClick={() => clickDecreaseColumns()}>Remove Height</button>
                <button onClick={() => clickIncreaseColumns()}>Add Height</button>
            </div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickClearSelectedGrid()}>Clear Selected Grid</button>
                <button onClick={() => clickClearSelectedRow()}>Clear Selected Row</button>
            </div>
            <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
                <button onClick={() => clickAddGrid()}>Add Grid</button>
                <button onClick={() => clickDeleteGrid()}>Delete Grid</button>
            </div>
        </div>
    );
}