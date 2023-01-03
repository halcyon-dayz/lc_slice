import React, {useState, useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../../../../features/hooks";
import { 
    deleteGrid, 
    copyGrid, 
    deleteAllStructs 
} from "../../../../features/sharedActions";
import { 
    changeGridCell, 
    changeGridCellData, 
    changeGridCellStatus 
} from "../../../../features/grids/gridsSlice";
import { 
    DEFAULT_ISLANDS_GRIDS 
} from "./IslandsGrids";
import {Cell} from "../../../../utils/types"
import {selectProblemNumber } from "../../../../features/problemInfo/problemSlice";
import { BasicController } from "../../BasicController";
import {GRID_CELL_INDEX_HAS_DATA, ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL, GRID_CELL_INDEX_GET_DATA, ARRAY_2D_GET_NEXT_INDEX} from "../../../../features/grids/gridUtils"
import { clearState } from "../../../../utils/clearState";
    
    
type P695_CONTEXT = [number, number][]
    
type P617_PROPS = {
    animationOn: boolean,
    play: () => void,
    pause: () => void,
    animationSpeed: number
}
    
export const Problem695Controller = ({animationOn, play, pause, animationSpeed}: P617_PROPS) => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const gridCells = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
    const problemNumber = useAppSelector(selectProblemNumber);

    /* Create Local State */
    const [defaultGridIndex, setDefaultGridIndex] = useState<number>(0);
    const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);
    const [stack, setStack] = useState<P695_CONTEXT>([]);

    //Function return values
    const [numIslands, setNumIslands] = useState<number>(0);
    const [maxArea, setMaxArea] = useState<number>(0);
    const [numClosedIslands, setNumClosedIslands] = useState<number>(0);
    const [numEnclaves, setNumEnclaves] = useState<number>(0);


    useEffect(() => {
        if (animationOn && problemNumber === 695) {
            setTimeout(() => clickStep695(), animationSpeed);
        }
    }, [currentCell, animationOn]);


    const clickSetUp695 = () => {
        clearState(dispatch, 695);
        //Get new grid
        const data = DEFAULT_ISLANDS_GRIDS[defaultGridIndex];
        //Set index to next grid
        setDefaultGridIndex((defaultGridIndex + 1) % DEFAULT_ISLANDS_GRIDS.length);
        //Generate cells
        const newGrid: Cell[][] = data.map((row, rowIdx) => {
            return row.map((col, colIdx) => {
                return {data: data[rowIdx][colIdx], status: "UNEXPLORED"}
            })
        })
        //Copy grid into ui
        dispatch(copyGrid({cells: newGrid}));
        //Dispatch proper statuses
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                if (data[i][j] === 1) {
                    dispatch(changeGridCellStatus({
                        gridIndex: 0,
                        row: i,
                        col: j,
                        status: "ISLAND"
                    }))
                } else {
                    dispatch(changeGridCellStatus({
                        gridIndex: 0,
                        row: i,
                        col: j,
                        status: "WATER"
                    }))
                }
            }
        }
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: 0, 
            col: 0, 
            status: "CURRENT"
        }))
        setCurrentCell([0, 0]);
        setStack([]);
    }

    const dfsCellIsValid = (cell: [number, number]): boolean => {
        return GRID_CELL_INDEX_HAS_DATA(gridCells, cell[0], cell[1], 1);
    }

    const exploreAndPushStack = (
        cell: [number, number], 
        nextCell: [number, number]
    ) => {
        //Indicate that next cell is current
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }))
        //Add the current context to the stack
        setStack([...stack, cell])
        //Set current cell to next cell
        setCurrentCell(nextCell);
    }

    const dfs = (cell: [number, number]) => {
        const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
            ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
        if (dfsCellIsValid(northOfCur)) {
            exploreAndPushStack(cell, northOfCur);
            return true;
        }
        if (dfsCellIsValid(eastOfCur)) {
            exploreAndPushStack(cell, eastOfCur);
            return true;
        }
        if (dfsCellIsValid(southOfCur)) {
            exploreAndPushStack(cell, southOfCur);
            return true;
        }
        if (dfsCellIsValid(westOfCur)) {
            exploreAndPushStack(cell, westOfCur);
            return true;
        }
    }

    const clickStep695 = () => {
        //Explore the current cell
        dispatch(changeGridCell({
            gridIndex: 0,
            row: currentCell[0],
            col: currentCell[1],
            status: "WATER",
            data: 0,
        }));

        if (stack.length) {
            if (dfs(currentCell) === true) {
                return;
            }
            let nextCell = stack[stack.length - 1];
            if (stack.length === 1) {
                nextCell = ARRAY_2D_GET_NEXT_INDEX(gridCells, nextCell[0], nextCell[1]);
            }
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: nextCell[0],
                col: nextCell[1],
                status: "CURRENT"
            }))
            setCurrentCell(nextCell);
            setStack(stack.slice(0, stack.length - 1));
            return;
        }

        //Increment area count here.
        if (dfs(currentCell) === true) {
            console.log("New dfs started")
            return;
        }

        const nextCell = ARRAY_2D_GET_NEXT_INDEX(gridCells, currentCell[0], currentCell[1]);
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }))
        setCurrentCell(nextCell);
    }

    return (
        <div>
            <BasicController 
                label={"Parse Islands"}
                setup={clickSetUp695}
                step={clickStep695}
                pause={pause}
                play={() => {
                    if (problemNumber !== 695) {
                        clickSetUp695()
                    }
                    play()
                }}
            />
            <div>

            </div>
        </div>
    );
}