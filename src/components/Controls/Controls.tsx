import { ControlsContainer } from "./styles"
import React from "react"
import { useSelector, useDispatch} from "react-redux";
import { changeHeight, changeWidth, gridSelector } from "../../features/grid/gridSlice";
import { changeCell } from "../../features/grid/gridSlice";
import { Cell } from "../../types";

const delay = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time));
}



export const Controls = () => {

    const grid = useSelector(gridSelector);
    const dispatch = useDispatch();

    const clickIncreaseRows = () => {
        dispatch(changeWidth({newWidth: grid.width + 1}))
    }

    const clickDecreaseRows = () => {
        if (grid.width - 1 >= 2) {
            dispatch(changeWidth({newWidth: grid.width - 1}))
        }
    }

    const clickIncreaseColumns = () => {
        dispatch(changeHeight({newHeight: grid.height + 1}))
    }

    const clickDecreaseColumns = () => {
        if (grid.height - 1 >= 2) {
            dispatch(changeHeight({newHeight: grid.height - 1}))
        }  
    }

    const dfs = (copyGrid: Cell[][], row: number, col: number, oldColor: number, newColor: number) => {
        if (row < 0 || col < 0 || col >= grid.width || row >= grid.height || copyGrid[row][col].data !== oldColor) {
            console.log(row);
            console.log(col);
            return;
        }
        if (copyGrid[row][col].data === oldColor) {
            dispatch(changeCell({row: row, col: col, data: newColor, status: "EXPLORED"}));
            dfs(copyGrid, row - 1, col, oldColor, newColor);
            dfs(copyGrid, row + 1, col, oldColor, newColor);
            dfs(copyGrid, row, col - 1, oldColor, newColor);
            dfs(copyGrid, row, col + 1, oldColor, newColor);
        }
    }

    const clickFloodFill = () => {
        const row = 0;
        const col = 0;
        const oldColor = grid.cells[row][col].data;
        const newColor = 2;
        let copyGrid = grid.cells;
        if (oldColor !== newColor) {
            dfs(copyGrid, row, col, oldColor, newColor)  
        }   
    }

    return (
    <ControlsContainer>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={() => clickDecreaseRows()}>Decrease Rows</button>
            <button onClick={() => clickIncreaseRows()}>Increase Rows</button>
        </div>
        <br></br>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={() => clickDecreaseColumns()}>Decrease Columns</button>
            <button onClick={() => clickIncreaseColumns()}>Increase Columns</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={() => clickFloodFill()}>Flood Fill From Start</button>
        </div>
    </ControlsContainer>);
}