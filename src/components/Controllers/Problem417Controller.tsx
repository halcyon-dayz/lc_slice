//#region Imports
import React, {useState} from "react"
import {
     useSelector 
} from "react-redux";
import { 
    copyGrids, 
    selectAllGrids, 
    changeGridLabels,
    changeGridCellStatus,
    changeGridCellData,
} from "../../features/grids/gridsSlice";
import { 
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    GRID_CELL_INDEX_HAS_DATA,
    GRID_CELL_INDEX_GET_DATA
} from "../../features/grids/gridUtils";
import { 
    deleteGrid
} from "../../features/sharedActions";
import { 
    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, 
    GRID_417_BOOLEAN
} from "../../features/grids/defaultGrids";
import { useAppDispatch } from "../../features/hooks";

//#endregion

//Equivalent to currentCell
type P417_CURRENT_CONTEXT_TYPE = [number, number]

type P417_STACK_CONTEXT_UNIT_TYPE = {
    prevTileValue: number,
    prevCell: [number, number]
}

//Designates whether to flood fill pacific or atlantic
type P417_GLOBALS = "PACIFIC" | "ATLANTIC"

export const Problem417Controller = () => {

    const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    //Equivalent to current cell
    const [currentCell, setCurrentCell] = useState<P417_CURRENT_CONTEXT_TYPE>([0, 0])
    const [stackContext, setStackContext] = useState<P417_STACK_CONTEXT_UNIT_TYPE[]>([]);
    const [globals, setGlobals] = useState<P417_GLOBALS>("PACIFIC");


    const clickSetUp417 = () => {
        dispatch(deleteGrid({num: grids.length}));
        dispatch(copyGrids([GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN, GRID_417_BOOLEAN]))
        dispatch(changeGridLabels(0, ["Water Flow", "Pacific", "Atlantic"]));
        setCurrentCell([0, 0]);
        setStackContext([]);
    }

    const onClickStep417 = () => {
        const waterFlowGrid = grids[0];
        const pacificGrid = grids[1];
        const atlanticGrid = grids[2];
        const i = currentCell[0]
        const j = currentCell[1];
        const curTileValue = waterFlowGrid.cells[currentCell[0]][currentCell[1]].data;

        const dfsPacific = (cell: [number, number]) => {
            const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
                ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, northOfCur[0], northOfCur[1], false) && 
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, northOfCur[0], northOfCur[1]) >= curTileValue
            ) {
                //Indicate that current cell has been explored...
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: cell[0],
                    col: cell[1],
                    status: "EXPLORED"
                }))
                //Indicate that next cell is current
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: northOfCur[0],
                    col: northOfCur[1],
                    status: "CURRENT"
                }))
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(northOfCur);
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, eastOfCur[0], eastOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, eastOfCur[0], eastOfCur[1]) >= curTileValue
            ) {
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: cell[0],
                    col: cell[1],
                    status: "EXPLORED"
                }))
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: eastOfCur[0],
                    col: eastOfCur[1],
                    status: "CURRENT"
                }))
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(eastOfCur); 
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, southOfCur[0], southOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, southOfCur[0], southOfCur[1]) >= curTileValue
            ) {
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: cell[0],
                    col: cell[1],
                    status: "EXPLORED"
                }))
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: southOfCur[0],
                    col: southOfCur[1],
                    status: "CURRENT"
                }))
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(southOfCur);
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, westOfCur[0], westOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, westOfCur[0], westOfCur[1]) >= curTileValue
            ) {
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: cell[0],
                    col: cell[1],
                    status: "EXPLORED"
                }))
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: westOfCur[0],
                    col: westOfCur[1],
                    status: "CURRENT"
                }))
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(westOfCur);
                return true;
            }
            return false;
        }
        if (stackContext.length !== 0) {
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i,
                col: j,
                status: "EXPLORED"
            }));
            dispatch(changeGridCellData({
                gridIndex: 1,
                row: i,
                col: j,
                data: true
            }));
            if (dfsPacific(currentCell) === true) {
                return;
            }
            //Pop stack and set currentCell to prevcell
            const prevCell = stackContext[stackContext.length - 1].prevCell;
            setCurrentCell(prevCell);
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: prevCell[0],
                col: prevCell[1],
                status: "CURRENT"
            }))
            setStackContext(stackContext.slice(0, stackContext.length - 1));
            return;
        }
        if (directToPacific(i, j)) {
            console.log("Direct to Pacific")
            //Set status of waterFlowGrid to explored
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i, 
                col: j,
                status: "EXPLORED"
            }));
            //Change data in the pacific grid to true
            dispatch(changeGridCellData({
                gridIndex: 1,
                row: currentCell[0],
                col: currentCell[1],
                data: true
            }));
            if (dfsPacific(currentCell) === true) {
                return;
            } else {
                const nextCell = ARRAY_2D_GET_NEXT_INDEX(waterFlowGrid.cells, i, j);
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: nextCell[0],
                    col: nextCell[1],
                    status: "CURRENT"
                }));
                setCurrentCell(ARRAY_2D_GET_NEXT_INDEX(waterFlowGrid.cells, i, j));
            }
            return;
        }
        const nextCell = ARRAY_2D_GET_NEXT_INDEX(waterFlowGrid.cells, i, j);
        if (nextCell[0] === 0 && nextCell[1] === 0) {
            

        }
        if (grids[1].cells[i][j].data === true) {
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i, 
                col: j,
                status: "EXPLORED"
            }));
        } else {
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i, 
                col: j,
                status: "UNEXPLORED"
            }));
        }
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }));
        setCurrentCell(ARRAY_2D_GET_NEXT_INDEX(waterFlowGrid.cells, i, j));
    }

    <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
        <button onClick={() => clickSetUp417()}>Set Up 417</button>
        <button onClick={() => clickStep417()}>Step 417</button>
        <button>Complete 417</button>
    </div>

}