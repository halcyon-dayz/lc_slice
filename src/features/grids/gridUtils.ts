import { CellStatus, RootState } from "../../utils/types";
import {PayloadAction} from "@reduxjs/toolkit"
import { Cell } from "../../utils/types";

/* Grid Utility Functions */
export const isValidIndex = (stateLength: number, index: number): boolean => {
	if (stateLength === 0 || index >= stateLength || index < 0) {
		return false;
	}
	return true;
}

export const isStateValid = (stateLength: number) => {
	if (stateLength === 0) {
		return false;
	}
	return true;
}

export const ARRAY_2D_IS_VALID_INDEX = <T,>(arr: T[][], row: number, col: number): boolean => {
    if (row < 0 || col < 0 || row >= arr.length || col >= arr[0].length) {
        return false
    }
    return true;
}

export const ARRAY_2D_GET_NEXT_INDEX = <T,>(arr: T[][], row: number, col: number): [number, number] => {
    if (ARRAY_2D_IS_VALID_INDEX(arr, row, col) === false) {
        return [-1, -1];
    }
    if (row === arr.length - 1 && col === arr[0].length - 1) {
        return [0, 0];
    }
    if (col === arr[0].length - 1 && ARRAY_2D_IS_VALID_INDEX(arr, row + 1, 0)) {
        return [row + 1, 0];
    }
    return [row, col + 1];
}

export const GRID_CELL_INDEX_HAS_STATUS = (arr: Cell[][], row: number, col: number, status: CellStatus): boolean => {
	return ( 
		ARRAY_2D_IS_VALID_INDEX(arr, row, col) &&
		arr[row][col].status === status
	)
}

/* Grid Slice Type Helpers */
export type GridBeforeEachFunc = (state: RootState["grids"], action?: PayloadAction<any>) => boolean;
export type GridDuringWithActionFunc = (state: RootState["grids"], action: PayloadAction<any>) => void
export type GridDuringFunc = (state: RootState["grids"]) => void;


/* Grid Slice Action Creators */
export const createGridActionSA = (beforeEach: GridBeforeEachFunc, during: GridDuringWithActionFunc) => {
	return (state: RootState["grids"], action: PayloadAction<any>) => {
		const beforeTest = beforeEach(state, action);
		console.log("before test ran")
		console.log(state.length);
		if (!beforeTest) {
			return;
		}
		during(state, action);
	}
}

export const createGridActionS = (beforeEach: GridBeforeEachFunc, during: GridDuringFunc) => {
	return (state: RootState["grids"]) => {
		const beforeTest = beforeEach(state);
		console.log("before test ran")
		console.log("state.length");
		if (!beforeTest) {
			return;
		}
		during(state);
	}
}