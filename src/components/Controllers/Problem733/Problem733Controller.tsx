//#region Imports
import React, {useState, useEffect} from "react"
import {
     useSelector 
} from "react-redux";

import { selectAllGrids, changeGridCell, changeGridCellStatus, changeGridCellSize, changeGridCellData} from "../../../features/grids/gridsSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { RootState } from "../../../utils/types";
import { GRID_733_FLOOD_FILL } from "../../../features/grids/defaultGrids";

import "../controller.css"
import { copyGrid, deleteAllStructs} from "../../../features/sharedActions";
import {
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    DirectionString,
    GRID_CELL_INDEX_HAS_DATA,
} from "../../../features/grids/gridUtils"
import { changeProblemNumber, pushJSXToLog, selectProblemNumber } from "../../../features/problemInfo/problemSlice";
import { clearState } from "../controllerUtils";
import {motion} from "framer-motion"
import {SearchFromToLog } from "../GridControllers/logUtils";
//#endregion

type P733_PROPS = {
    animationOn: boolean,
    play: () => void,
    pause: () => void,
    animationSpeed: number
}

export const Problem733Controller = ({animationOn, play, pause, animationSpeed}: P733_PROPS) => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const gridCells = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
    const problemNumber = useSelector(selectProblemNumber);
    /* Local State */
    const [toReplace, setToReplace] = useState<number>(0);
    const [replaceWith, setReplaceWith] = useState<number>(2);
    const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);
    const [stack, setStack] = useState<[number, number][]>([]);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    useEffect(() => {
        if (animationOn && problemNumber === 733) {
            setTimeout(() => clickStep733(), animationSpeed);
        }
    }, [currentCell, animationOn])

    /* Change Input Values */
    const onChangeToReplace = (e: React.FormEvent<HTMLInputElement>) => {
        setToReplace(parseInt(e.currentTarget.value));
    }

    const onChangeReplaceWith = (e: React.FormEvent<HTMLInputElement>) => {
        setReplaceWith(parseInt(e.currentTarget.value));
    }

    /* Problem Functions */
    const clickSetUp733 = () => {
        //Stop any animations
        pause();
        //Delete all structs
        clearState(dispatch, 733);
        //dispatch(deleteAllStructs());
        //Change Problem Number
        //dispatch(changeProblemNumber({problemNumber: 733}));
        dispatch(copyGrid({cells: GRID_733_FLOOD_FILL}));
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: 0, 
            col: 0, 
            status: "CURRENT"
        }))
        setCurrentCell([0,0]);
        const element: JSX.Element = (
            <div style={{display: "flex", "flexDirection": "column", alignItems: "center"}}>
                <div>Created a grid!</div>
                <motion.h4 
                    whileHover={{scale: 1.4, transition: {duration: 0.2, ease: "easeOut"}}} style={{"display": "inline-block", margin: "0 0 0 0"}}
                    onMouseEnter={() => 
                        dispatch(changeGridCellSize({
                            gridIndex: 0, 
                            width: 70, 
                            height: 70
                        }))
                    }
                    onMouseLeave={() => 
                        dispatch(changeGridCellSize({
                            gridIndex: 0, 
                            width: 60, 
                            height: 60
                    }))
                    }   
                >
                    {`Flood Fill Grid`}
                </motion.h4>
            </div>
        );
        //dispatch(clearLog())
        dispatch(pushJSXToLog({element: element}))
        setIsEnd(false);
    }

    const dfsCellIsValid = (cell: [number, number]): boolean => {
        return GRID_CELL_INDEX_HAS_DATA(gridCells, cell[0], cell[1], toReplace);
    }

    const exploreAndPushStack = (
        cell: [number, number], 
        nextCell: [number, number],
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
        let element = (
            <SearchFromToLog 
                dispatch={dispatch}
                cell={cell}
                nextCell={nextCell}
                direction={direction}
            />
        );
        dispatch(pushJSXToLog({element: element}));
        //Add the current context to the stack
        setStack([...stack, cell])
        //Set current cell to next cell
        setCurrentCell(nextCell);
    }

    const dfs = (cell: [number, number]) => {
        const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
            ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
        if (dfsCellIsValid(northOfCur)) {
            exploreAndPushStack(cell, northOfCur, "north");
            return true;
        }
        if (dfsCellIsValid(eastOfCur)) {
            exploreAndPushStack(cell, eastOfCur, "east");
            return true;
        }
        if (dfsCellIsValid(southOfCur)) {
            exploreAndPushStack(cell, southOfCur, "south");
            return true;
        }
        if (dfsCellIsValid(westOfCur)) {
            exploreAndPushStack(cell, westOfCur, "west");
            return true;
        }
    }


    const clickStep733 = () => {
        if (gridCells[currentCell[0]][currentCell[1]].data !== toReplace) {
            let element: JSX.Element = <p><i>{`WARNING! `}</i>The cell does not have a value from which a flood fill can occur.</p>
            dispatch(pushJSXToLog({element: element}));
            return;
        }
        dispatch(changeGridCellData({
            gridIndex: 0, 
            data: replaceWith, 
            row: currentCell[0], 
            col: currentCell[1], 
        }))

        if (dfs(currentCell)) {
            return;
        }

        if (currentCell[0] === 0 && currentCell[1] === 0) {
            setIsEnd(true);
        }

        console.log("No new paths found")
        const nextCell = (stack[stack.length - 1]);
        dispatch(changeGridCellStatus({
            gridIndex: 0, 
            row: nextCell[0],
            col: nextCell[1],
            status: "CURRENT"
        }))
        setCurrentCell(nextCell);
        setStack(stack.slice(0, stack.length - 1));
    }

    const zilch = () => {
        return;
    }

    return (
        <div className={"controller"}>
            <div className={"controller_contents_container"}>
            <b>Flood Fill:</b>
                <div className={"controller_buttons_container"}>
                    <button className={"controller_button"} onClick={() => clickSetUp733()}>Set Up</button>
                    <button className={"controller_button"} onClick={() => {isEnd ? zilch() : clickStep733()}}>Step</button>
                    <button className={"controller_button"} onClick={() => pause()}>Pause</button>
                    <button className={"controller_button"} onClick={() => {
                        if (problemNumber !== 733) {
                            clickSetUp733();
                        }
                        play()}
                    }>Play</button>  
                </div>
                <div className={"controller_buttons_container"}>
                    Replace:
                    <input 
                        type="number"
                        min={0}
                        max={9}
                        step={1}
                        value={toReplace}
                        onChange={onChangeToReplace}
                        style={{"marginLeft": "5px", "width": "40px", "marginRight": "5px"}}
                    />
                    With: 
                    <input 
                        type="number"
                        min={0}
                        max={9}
                        step={1}
                        value={replaceWith}
                        onChange={onChangeReplaceWith}
                        style={{"width": "40px", "marginLeft": "5px"}}
                    />
                </div>
            </div>
        </div>
    );

}