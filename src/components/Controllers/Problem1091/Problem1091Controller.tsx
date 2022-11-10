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

export const Problem1091Controller = () => {
    /* Access the Global State */
    const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    const [defaultGridIndex, setDefaultGridIndex] = useState<number>(0);

    const clickSetUp1091 = () => {
        dispatch(deleteGrid({num: grids.length}));
        dispatch(copyGrid({cells: DEFAULT_1091_GRIDS[defaultGridIndex]}));
        const idx = defaultGridIndex + 1;
        setDefaultGridIndex(idx % 4);
    }

} 