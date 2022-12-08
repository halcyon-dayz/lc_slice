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
	if (stateLength <= 0) {
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


export type DirectionString = "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest" | "none" | "undefined"


export const ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL = <T,>(
	prevCell: [number, number],
	curCell: [number, number],
	asString?: boolean
): DirectionString | [number, number] => {
	const vertDir = curCell[0] - prevCell[0];
	const horDir = curCell[1] - prevCell[1];
	if (!asString) {
		return [vertDir, horDir];
	} 
	/*
	----------------
	|    |    |    |
	----------------
	----------------
	|    |    |    |
	----------------
	----------------
	|    |    |    |
	----------------
	*/
	if (horDir === 0 && vertDir === 0) {
		return "none";
	}
	//CARDINAL DIRECTIONS
	if (horDir === 0 && vertDir < 0) {
		return "north"
	}
	if (horDir === 0 && vertDir > 0) {
		return "south"
	}
	if (horDir > 0 && vertDir === 0) {
		return "east"
	}
	if (horDir < 0 && vertDir === 0) {
		return "west"
	}
	//WEIRDO DIRECTIONS
	if (horDir > 0 && vertDir < 0) {
		return "northeast"
	}
	if (horDir > 0 && vertDir > 0) {
		return "southeast"
	}
	if (horDir < 0 && vertDir < 0) {
		return "northwest"
	}
	if (horDir < 0 && vertDir > 0) {
		return "southwest"
	}
	return "undefined";
}


/**
* Query whether a cell in the grid exists and has the specified data.
* @param {Cell[][]} arr 
*  The array of cells
* @param {number} row  
*  The row of the cell.
* @param {number} col 
*  The column of the cell.
* @param {any} status
*  The status the user expects the cell to have.
*/
export const GRID_CELL_INDEX_HAS_STATUS = (arr: Cell[][], row: number, col: number, status: CellStatus): boolean => {
	return ( 
		ARRAY_2D_IS_VALID_INDEX(arr, row, col) &&
		arr[row][col].status === status
	)
}

export const GRID_CELL_INDEX_GET_STATUS = (arr: Cell[][], row: number, col: number): CellStatus => {
	return arr[row][col].status;

}
/**
* Query whether a cell in the grid exists and has the specified data.
* @param {Cell[][]} arr 
*  The array of cells
* @param {number} row  
*  The row of the cell.
* @param {number} col 
*  The column of the cell.
* @param {any} data
*  The data the user expects to exist in the cell.
*/
export const GRID_CELL_INDEX_HAS_DATA = (arr: Cell[][], row: number, col: number, data: any): boolean => {
	return (
		ARRAY_2D_IS_VALID_INDEX(arr, row, col) &&
		arr[row][col].data === data
	);
}

export const GRID_CELL_INDEX_GET_DATA = (arr: Cell[][], row: number, col: number): any => {
	return arr[row][col].data;
}

export const ARRAY_2D_IS_INDEX_SAME = (c1: [number, number], c2: [number, number]) => {
	if (c1[0] === c2[0] && c1[0] === c2[0]) {
		return true;
	}
	return false;
}

export const GRID_CELL_ADD = (cells: [number, number][]): [number, number] => {
	let partOne = 0;
	let partTwo = 0;
	for (let i = 0; i < cells.length; i++) {
		partOne += cells[i][0];
		partTwo += cells[i][1];
	}
	return [partOne, partTwo];
}

export const ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL = (
	cell: [number, number]
) : [number, number][] => {
	//North->East->South->West
	const north = GRID_CELL_ADD([cell, [-1, 0]]);
	const east = GRID_CELL_ADD([cell, [0, 1]]);
	const south = GRID_CELL_ADD([cell, [1, 0]]);
	const west = GRID_CELL_ADD([cell, [0, - 1]]);
	return [
		north, east, south, west
	];
}

/* Directional Utilities */
export const northDir: [number, number] = [-1, 0];
export const eastDir: [number, number] = [0, 1];
export const westDir: [number, number] = [0, -1];
export const southDir: [number, number] = [1, 0]

export const ARRAY_2D_GET_EIGHT_DIRECTIONS_FROM_CELL = (
	cell: [number, number]
): [number, number][] => {
	//North->NorthEast->East->SouthEast->South->SouthWest->West->NorthWest
	const north = GRID_CELL_ADD([cell, northDir]);
	const east = GRID_CELL_ADD([cell, eastDir]);
	const south = GRID_CELL_ADD([cell, southDir]);
	const west = GRID_CELL_ADD([cell, westDir]);
	const northeast = GRID_CELL_ADD([cell, northDir, eastDir]);
	const southeast = GRID_CELL_ADD([cell, southDir, eastDir]);
	const southwest = GRID_CELL_ADD([cell, southDir, westDir]);
	const northwest = GRID_CELL_ADD([cell, northDir, westDir]);
	return [
		north,
		northeast,
		east,
		southeast,
		south,
		southwest,
		west,
		northwest
	]
}

export const ARRAY_2D_CONVERT_TO_CELL = <T>(arr: T[][]): Cell[][] => {
	let cellArray: Cell[][] = [];
	for (let i = 0; i < arr.length; i++) {
		let innerArr: Cell[] = [];
		for (let j = 0; j < arr[0].length; j++) {
			innerArr.push({data: arr[i][j], status: "UNEXPLORED"});
		}
		cellArray.push(innerArr);
	}
	return cellArray;
}

/* Grid Slice Type Helpers */
export type GridBeforeEachFunc = (state: RootState["grids"], action?: PayloadAction<any>) => boolean;
export type GridDuringWithActionFunc = (state: RootState["grids"], action: PayloadAction<any>) => void
export type GridDuringFunc = (state: RootState["grids"]) => void;

/* Grid Slice Action Creators */
export const createGridActionSA = (beforeEach: GridBeforeEachFunc, during: GridDuringWithActionFunc) => {
	return (state: RootState["grids"], action: PayloadAction<any>) => {
		const beforeTest = beforeEach(state, action);
		if (!beforeTest) {
			return;
		}
		during(state, action);
	}
}

export const createGridActionS = (beforeEach: GridBeforeEachFunc, during: GridDuringFunc) => {
	return (state: RootState["grids"]) => {
		const beforeTest = beforeEach(state);
		if (!beforeTest) {
			return;
		}
		during(state);
	}
}