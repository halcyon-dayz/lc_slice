//#region Imports
import React, {useState, useEffect, useMemo} from "react"
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
    clearGridCellsStatus,
    changeGridCellSize,
    changeGridIndividualCellSize
} from "../../../features/grids/gridsSlice";
import { 
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    GRID_CELL_INDEX_HAS_DATA,
    GRID_CELL_INDEX_GET_DATA,
    ARRAY_2D_GET_NEXT_INDEX,
    DirectionString
} from "../../../features/grids/gridUtils";
import { 
    deleteAllStructs,
    deleteGrid
} from "../../../features/sharedActions";
import { 
    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, 
    GRID_417_BOOLEAN
} from "../../../features/grids/defaultGrids";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";

import "../controller.css"
import { changeProblemNumber, clearLog, pushJSXToLog, selectProblemNumber } from "../../../features/problemInfo/problemSlice";
import { BasicController } from "../BasicController";
import {motion} from "framer-motion"
import { clearState} from "../controllerUtils";
import { CellHighlighter, TextHighlighter } from "../CellHighlighter";
//#endregion

//Equivalent to currentCell
type P417_CURRENT_CONTEXT_TYPE = [number, number]

type P417_STACK_CONTEXT_UNIT_TYPE = {
    prevTileValue: number,
    prevCell: [number, number]
}


//Designates whether to flood fill pacific or atlantic
type P417_GLOBALS = "PACIFIC" | "ATLANTIC"

//Ideally only one question at a time should be displayed, 
//so this shouldn't trigger multiple animations at once
type P417_PROPS = {
    animationOn: boolean,
    play: () => void;
    pause: () => void;
    animationSpeed: number
}

export const Problem417Controller = ({animationOn, play, pause, animationSpeed}: P417_PROPS) => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    //Grids
    const waterFlowGridWidth = useAppSelector(state => state.grids[0] ? state.grids[0].width : 0);
    const waterFlowGridHeight = useAppSelector(state => state.grids[0] ? state.grids[0].height : 0);
    const waterFlowGridCells = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
    //Grid cells
    const pacificCells = useAppSelector(state => state.grids[1] ? state.grids[1].cells : []);
    const atlanticCells = useAppSelector(state => state.grids[2] ? state.grids[2].cells : []);
    //Problem Number
    const problemNumber = useAppSelector(selectProblemNumber);
    /* Set local state variables */
    const [buildFinished, setBuildFinished] = useState<boolean>(false);
    const [currentCell, setCurrentCell] = useState<P417_CURRENT_CONTEXT_TYPE>([0, 0])
    const [stackContext, setStackContext] = useState<P417_STACK_CONTEXT_UNIT_TYPE[]>([]);
    const [globals, setGlobals] = useState<P417_GLOBALS>("PACIFIC");

    useEffect(() => {
        if (animationOn && problemNumber === 417) {
            setTimeout(() => clickStep417(), animationSpeed);
        }
    }, [currentCell, animationOn]);

    const directToPacific = (i: number, j: number): boolean => {
        if (i === 0 || j === 0) {
            return true;
        }
        return false;
    }

    const directToAtlantic = (i: number, j: number): boolean => {
        //if (i === grids[0].cells.length - 1 || j === grids[0].cells[0].length - 1) {
        if (i === waterFlowGridHeight - 1 || j === waterFlowGridWidth - 1) {
            return true;
        }
        return false;
    }


    const clickSetUp417 = () => {
        clearState(dispatch, 417);
        dispatch(copyGrids([GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN, GRID_417_BOOLEAN]));
        let gridLabels = ["Water Flow", "Pacific", "Atlantic"];
        dispatch(changeGridLabels(0, gridLabels));
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: 0,
            col: 0,
            status: "CURRENT",
        }));
        setCurrentCell([0, 0]);
        setStackContext([]);
        setGlobals("PACIFIC");
        setBuildFinished(true);
        //Add to log
        const element: JSX.Element = (
            <div style={{display: "flex", "flexDirection": "column", alignItems: "center"}}>
                <div>Created three grids!</div>
                {[...Array(3)].map((ele, idx) => (
                    <motion.h4 key={`LOG_${gridLabels[idx]}`}
                        whileHover={{scale: 1.4, transition: {duration: 0.2, ease: "easeOut"}}} style={{"display": "inline-block", margin: "0 0 0 0"}}
                    onMouseEnter={() => 
                        dispatch(changeGridCellSize({
                            gridIndex: idx, 
                            width: 70, 
                            height: 70
                        }))
                    }
                    onMouseLeave={() => 
                        dispatch(changeGridCellSize({
                            gridIndex: idx, 
                            width: 60, 
                            height: 60
                        }))
                    }   
                >
                    {`${idx + 1}. ${gridLabels[idx]}`}
                </motion.h4>
                ))}
            </div>
        )
        //dispatch(clearLog())
        dispatch(pushJSXToLog({element: element}))
    }

    const exploreAndPushStack = (
        cell: [number, number], 
        nextCell: [number, number], 
        tileValue: number,
        nextTileValue: number, 
        direction: DirectionString
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let element: JSX.Element = (
            <p>
                <b>{`Searched `}</b><i>{`${direction}`}</i><b>{` from cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={cell} />
                <b>{` with value `}</b><i>{`${tileValue}`}</i><b>{` to cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={nextCell}/>
                <b>{` with value `}</b><i>{`${nextTileValue}.`}</i>
            </p> 
        );
        dispatch(pushJSXToLog({element: element}));
        //Set current cell to next cell
        setCurrentCell(nextCell);
    }

    const handleReturnToStart = (isPacific: boolean) => {
        if (isPacific) {
            setGlobals("ATLANTIC");
            dispatch(clearGridCellsStatus({gridIndex: 0, defaultStatus: "UNEXPLORED"}));
            let element: JSX.Element = (<p><b>Returned to first cell to flood fill from the Atlantic</b></p>)
            dispatch(pushJSXToLog({element: element}));
        //Find mountains if last atlantic cell reached
        } else {
            setGlobals("PACIFIC");
            dispatch(clearGridCellsStatus({gridIndex: 0, defaultStatus: "UNEXPLORED"}));
            let element: JSX.Element = (<p><b>Completed search!</b></p>)
            const islandCells: [number, number][] = [];
            dispatch(pushJSXToLog({element: element}));
            for (let i = 0; i < waterFlowGridHeight; i++) {
                for (let j = 0; j < waterFlowGridWidth; j++) {
                    if (pacificCells[i][j].data === true && atlanticCells[i][j].data === true) {
                        dispatch(changeGridCellStatus({gridIndex: 0, row: i, col: j, status: "ISLAND"}));
                        islandCells.push([i, j]);
                    }
                }
            }

            const onEnter = () => {
                for (let i = 0; i < islandCells.length; i++) {
                    dispatch(changeGridIndividualCellSize({
                        gridIndex: 0, 
                        row: islandCells[i][0],
                        col: islandCells[i][1],
                        width: 60, 
                        height: 60,
                    }))
                }
            }
            const onLeave = () => {
                for (let i = 0; i < islandCells.length; i++) {
                    dispatch(changeGridIndividualCellSize({
                        gridIndex: 0, 
                        row: islandCells[i][0],
                        col: islandCells[i][1],
                        width: undefined, 
                        height: undefined,
                    }))
                }

            }
            element = (<p>
                <TextHighlighter text={"Green Mountains"}onEnter={onEnter} onLeave={onLeave} color={"green"}/>
                {`: ${islandCells.map(cell => `[${cell[0]}, ${cell[1]}]`)}`}
                </p>
            );
            dispatch(pushJSXToLog({element: element}));
            pause();
        }
    }

    const clickStep417 = () => {
        if (!buildFinished) {
            clickSetUp417();
        }
        const i = currentCell[0]
        const j = currentCell[1];
        const curTileValue = waterFlowGridCells[currentCell[0]][currentCell[1]].data;

        const isPacific = globals === "PACIFIC";

        const dfsCellIsValid = (cell: [number, number]): boolean => {
            if (isPacific) {
                return (
                    //Check if pacific/atlantic grid has false in cell
                    GRID_CELL_INDEX_HAS_DATA(pacificCells, cell[0], cell[1], false) &&
                    //Check if flow gird cell is greater/equal to current cell value
                    GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, cell[0], cell[1]) >= curTileValue
                );
            } else {
                return (
                    //Check if pacific/atlantic grid has false in cell
                    GRID_CELL_INDEX_HAS_DATA(atlanticCells, cell[0], cell[1], false) &&
                    //Check if flow gird cell is greater/equal to current cell value
                    GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, cell[0], cell[1]) >= curTileValue
                );
            }
        }

        const dfs = (cell: [number, number]) => {
            const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
                ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
            if (dfsCellIsValid(northOfCur)) {
                const nextTileValue = GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, northOfCur[0], northOfCur[1]);
                exploreAndPushStack(cell, northOfCur, curTileValue, nextTileValue, "north");
                return true;
            }
            if (dfsCellIsValid(eastOfCur)) {
                const nextTileValue = GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, eastOfCur[0], eastOfCur[1]);
                exploreAndPushStack(cell, eastOfCur, curTileValue, nextTileValue, "east");
                return true;
            }
            if (dfsCellIsValid(southOfCur)) {
                const nextTileValue = GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, southOfCur[0], southOfCur[1]);
                exploreAndPushStack(cell, southOfCur, curTileValue, nextTileValue, "south");
                return true;
            }
            if (dfsCellIsValid(westOfCur)) {
                const nextTileValue = GRID_CELL_INDEX_GET_DATA(waterFlowGridCells, westOfCur[0], westOfCur[1]);
                exploreAndPushStack(cell, westOfCur, curTileValue, nextTileValue, "west");
                return true;
            }
            return false;
        }

        if (stackContext.length !== 0) {
            //Always set current cell back to explored just in case dfs returns no new paths
            dispatch(changeMultiGridSameCellStatus(isPacific ? [0, 1] : [0, 2], i, j, "EXPLORED"));
            dispatch(changeGridCellData({
                gridIndex: isPacific ? 1 : 2,
                row: i,
                col: j,
                data: true
            }));
            if (dfs([i, j]) === true) {
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
        const directTo = isPacific ? directToPacific : directToAtlantic
        if (directTo(i, j) ) {
            //Set status of cell in flowGrid and pacificGrid to explored
            dispatch(changeMultiGridSameCellStatus(isPacific ? [0, 1] : [0, 2], i, j, "EXPLORED"));
            //Change data in the pacific grid to true
            dispatch(changeGridCellData({
                gridIndex: isPacific ? 1 : 2,
                row: currentCell[0],
                col: currentCell[1],
                data: true
            }));
            if (dfs(currentCell) === true) {
                return;
            } else {
                const nextCell = ARRAY_2D_GET_NEXT_INDEX(waterFlowGridCells, i, j);
                if (nextCell[0] === 0 && nextCell[1] === 0) {
                    handleReturnToStart(isPacific);
                }
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: nextCell[0],
                    col: nextCell[1],
                    status: "CURRENT"
                }));
                setCurrentCell(ARRAY_2D_GET_NEXT_INDEX(waterFlowGridCells, i, j));
            }
            //Reconsider this return statement
            return;
        }
        //Change the current cell back to it's previous status if no new paths found
        if (isPacific ? pacificCells[i][j].data === true : atlanticCells[i][j].data === true) {
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
        const nextCell = ARRAY_2D_GET_NEXT_INDEX(waterFlowGridCells, i, j);
        if (nextCell[0] === 0 && nextCell[1] === 0) {
           handleReturnToStart(isPacific);
        }
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }));
        let element: JSX.Element = (
            <p>{`Iterated from cell`}
                <CellHighlighter dispatch={dispatch} cell={currentCell}/>
            </p>
        )
        dispatch(pushJSXToLog({element: element}))
        setCurrentCell(nextCell);
    }
    
    return (
        <BasicController
            label={"Pacific Atlantic Waterflow:"}
            setup={clickSetUp417}
            step={clickStep417}
            pause={pause}
            play={() => {
                if (problemNumber !== 417) {
                    clickSetUp417();
                }
                play();
            }}
        />
    );

}