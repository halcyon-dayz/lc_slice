import { useAppDispatch } from "../../../features/hooks";
import { useSelector} from "react-redux";
import { deleteGrid, copyGrid } from "../../../features/sharedActions";
import { selectAllGrids } from "../../../features/grids/gridsSlice";
import { DEFAULT_1091_GRIDS } from "../Problem1091/1091Defaults";
import React, {useState} from "react"
import { DEFAULT_695_GRIDS } from "./695Defaults";
import {Cell} from "../../../utils/types"


type P695_CONTEXT = [number, number][]

export const Problem695Controller = () => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    const [defaultGridIndex, setDefaultGridIndex] = useState<number>(0);
    const [stackContext, setStackContext] = useState<P695_CONTEXT>([]);

    const clickSetUp695 = () => {
        //Clear all previous ds
        dispatch(deleteGrid({num: grids.length}));
        //Get new grid
        const data = DEFAULT_695_GRIDS[defaultGridIndex];
        const newGrid: Cell[][] = data.map((row, rowIdx) => {
            return row.map((col, colIdx) => {
                return {data: data[rowIdx][colIdx], status: "UNEXPLORED"}
            })
        })
        dispatch(copyGrid({cells: newGrid}));
        setDefaultGridIndex((defaultGridIndex + 1) % DEFAULT_695_GRIDS.length);
    }

    const clickStep695 = () => {

        


    }

    return (
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={() => clickSetUp695()}>Set Up 695</button>
            <button onClick={() => clickStep695()}>Step 695</button>
            <button>Complete 695</button>
        </div>
    );

} 