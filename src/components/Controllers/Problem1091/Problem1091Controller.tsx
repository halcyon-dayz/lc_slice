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
    deleteGrid,
    copyGrid
} from "../../../features/sharedActions";
import { 
    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, 
    GRID_417_BOOLEAN
} from "../../../features/grids/defaultGrids";
import { useAppDispatch } from "../../../features/hooks";
import { DEFAULT_1091_GRIDS } from "./1091Defaults";

//#endregion

//Equivalent to currentCell


type P1091_GLOBALS = {
    lastCell: [number, number]
}

export const Problem1091Controller = () => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    const [defaultGridIndex, setDefaultGridIndex] = useState<number>(0);
    const [globals, setGlobals] = useState<P1091_GLOBALS>({
        lastCell: [-1, -1]
    });

    const clickSetUp1091 = () => {
        //Clear all previous ds
        dispatch(deleteGrid({num: grids.length, gridsLength: grids.length}));
        //Get new grid
        const selectedGrid = DEFAULT_1091_GRIDS[defaultGridIndex];
        dispatch(copyGrid({cells: selectedGrid}));
        //Do something if there is no path
        const firstCell = selectedGrid[0][0];
        const lastCell = selectedGrid[selectedGrid.length][selectedGrid.length - 1];
        if (firstCell.data === 1 || lastCell.data === 1) {
            return;
        }
    }

    const clickStep1091 = () => {
        


    }

    return (
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={() => clickSetUp1091()}>Set Up 1091</button>
            <button onClick={() => clickStep1091()}>Step 1091</button>
            <button>Complete 1091</button>
        </div>
    );

} 