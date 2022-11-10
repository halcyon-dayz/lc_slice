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
    changeMultiGridSameCellStatus,
} from "../../../features/grids/gridsSlice";
import { 
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    GRID_CELL_INDEX_HAS_DATA,
    GRID_CELL_INDEX_GET_DATA,
    ARRAY_2D_GET_NEXT_INDEX
} from "../../../features/grids/gridUtils";
import { 
    deleteGrid
} from "../../../features/sharedActions";
import { 
    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, 
    GRID_417_BOOLEAN
} from "../../../features/grids/defaultGrids";
import { useAppDispatch } from "../../../features/hooks";

//#endregion

//Equivalent to currentCell
type P417_CURRENT_CONTEXT_TYPE = [number, number]

type P417_STACK_CONTEXT_UNIT_TYPE = {
    prevTileValue: number,
    prevCell: [number, number]
}

enum gL {
    PACIFIC = 1,
    ATLANTIC = 2
}

//Designates whether to flood fill pacific or atlantic
type P417_GLOBALS = "PACIFIC" | "ATLANTIC"

export const Problem417Controller = () => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    /* Set local state variables */
    const [currentCell, setCurrentCell] = useState<P417_CURRENT_CONTEXT_TYPE>([0, 0])
    const [stackContext, setStackContext] = useState<P417_STACK_CONTEXT_UNIT_TYPE[]>([]);
    const [globals, setGlobals] = useState<P417_GLOBALS>("PACIFIC");

    const directToPacific = (i: number, j: number): boolean => {
        if (i === 0 || j === 0) {
            return true;
        }
        return false;
    }

    const directToAtlantic = (i: number, j: number): boolean => {
        if (i === grids[0].cells.length - 1 || j === grids[0].cells[0].length - 1) {
            return true;
        }
        return false;
    }

    const clickSetUp417 = () => {
        dispatch(deleteGrid({num: grids.length, gridsLength: grids.length}));
        dispatch(copyGrids([GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN, GRID_417_BOOLEAN]))
        dispatch(changeGridLabels(0, ["Water Flow", "Pacific", "Atlantic"]));
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: 0,
            col: 0,
            status: "CURRENT",
        }));
        setCurrentCell([0, 0]);
        setStackContext([]);
    }

    const exploreAndPushStack = (
        cell: [number, number], 
        nextCell: [number, number], 
        tileValue: number
    ) => {
        //Indicate that the current cell is explored
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: cell[0],
            col: cell[1],
            status: "EXPLORED"
        }))
        //Indicate that next cell is current
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }))
        //Add the current context to the stack
        setStackContext([...stackContext, {prevCell: cell, prevTileValue: tileValue}])
        //Set current cell to next cell
        setCurrentCell(nextCell);
    }

    const clickStep417 = () => {
        const waterFlowGrid = grids[0];
        const pacificGrid = grids[1];
        const atlanticGrid = grids[2];
        const i = currentCell[0]
        const j = currentCell[1];
        const curTileValue = waterFlowGrid.cells[currentCell[0]][currentCell[1]].data;

        const dfsCellIsValid = (cell: [number, number]): boolean => {
            if (globals === "PACIFIC") {
                return (
                    //Check if pacific/atlantic grid has false in cell
                    GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, cell[0], cell[1], false) &&
                    //Check if flow gird cell is greater/equal to current cell value
                    GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, cell[0], cell[1]) >= curTileValue
                );
            } else {
                return (
                    //Check if pacific/atlantic grid has false in cell
                    GRID_CELL_INDEX_HAS_DATA(atlanticGrid.cells, cell[0], cell[1], false) &&
                    //Check if flow gird cell is greater/equal to current cell value
                    GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, cell[0], cell[1]) >= curTileValue
                );
            }
        }

        const dfsPacific = (cell: [number, number]) => {
            const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
                ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
            if (dfsCellIsValid(northOfCur)) {
                exploreAndPushStack(cell, northOfCur, curTileValue);
                return true;
            }
            if (dfsCellIsValid(eastOfCur)) {
                exploreAndPushStack(cell, eastOfCur, curTileValue);
                return true;
            }
            if (dfsCellIsValid(southOfCur)) {
                exploreAndPushStack(cell, southOfCur, curTileValue);
                return true;
            }
            if (dfsCellIsValid(westOfCur)) {
                exploreAndPushStack(cell, westOfCur, curTileValue);
                return true;
            }
            return false;
        }

        if (stackContext.length !== 0) {
            //Always set current cell back to explored just in case dfs returns no new paths
            dispatch(changeMultiGridSameCellStatus([0, 1], i, j, "EXPLORED"));
            dispatch(changeGridCellData({
                gridIndex: 1,
                row: i,
                col: j,
                data: true
            }));
            if (dfsPacific([i, j]) === true) {
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

    return (
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={() => clickSetUp417()}>Set Up 417</button>
            <button onClick={() => clickStep417()}>Step 417</button>
            <button>Complete 417</button>
        </div>
    );

}