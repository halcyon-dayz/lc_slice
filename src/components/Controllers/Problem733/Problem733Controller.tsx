//#region Imports
import React, {useState, useEffect} from "react"
import {
     useSelector 
} from "react-redux";

import { selectAllGrids, changeGridCell, changeGridCellStatus} from "../../../features/grids/gridsSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { RootState } from "../../../utils/types";
import { GRID_733_FLOOD_FILL } from "../../../features/grids/defaultGrids";

import "../controller.css"
import { copyGrid, deleteAllStructs} from "../../../features/sharedActions";
import {
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    GRID_CELL_INDEX_HAS_DATA,
} from "../../../features/grids/gridUtils"
import { changeProblemNumber, selectProblemNumber } from "../../../features/problemInfo/problemSlice";
import { clearState } from "../controllerUtils";
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
        setIsEnd(false);
    }

    const dfsCellIsValid = (cell: [number, number]): boolean => {
        return GRID_CELL_INDEX_HAS_DATA(gridCells, cell[0], cell[1], toReplace);
    }

    const exploreAndPushStack = (
        cell: [number, number], 
        nextCell: [number, number]
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


    const clickStep733 = () => {
        dispatch(changeGridCell({
            gridIndex: 0, 
            data: replaceWith, 
            row: currentCell[0], 
            col: currentCell[1], 
            status: "EXPLORED"
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