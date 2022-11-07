//#region Imports
import {createSlice} from "@reduxjs/toolkit"
import {RootState, Cell, GridDS} from "../../utils/types"
import { PayloadAction } from "@reduxjs/toolkit"
import * as GridPayloads from "./gridPayloads"

import { GRID_GENERIC_CONTEXT } from "./gridTypes"

import {
	addGrid,
	AddGridPayload,
	deleteGrid,
	DeleteGridPayload,
	deleteGridAt,
	DeleteGridAtPayload,
	copyGrid,
	CopyGridPayload
} from "../sharedActions"

import {
	isValidIndex,
	isStateValid,
	GridBeforeEachFunc,
	GridDuringFunc,
	GridDuringWithActionFunc,
	createGridActionS,
	createGridActionSA
} from "./gridUtils"

import { ThunkAction} from "@reduxjs/toolkit";
import { Action } from "@reduxjs/toolkit";
import {defaultGrid} from "../../utils/defaultData";

//#endregion

//Default Cell value

const initialState: RootState["grids"] = [];

const gridBeforeEach: GridBeforeEachFunc = (state: RootState["grids"], action?: PayloadAction<any>) => {
	return action ? ( isValidIndex(state.length, action.payload.gridIndex) ) : (isStateValid(state.length))
}

// #region Reducer object
const gridsReducerObject = {
	/**
	 * Changes the width of the grid, adding a new column to each row.
	 * @param {RootState} state The current state of the Redux store.
	 * @param {PayloadAction<ChangeGridWidthPayload>} action  Redux PayloadAction containing the params below.
	 * @param {number} action.payload.gridIndex The grid in the grid list to be operated on.
	 * @param {number} action.payload.newWidth The new width (num. columns) of the grid.
	 * @param {number} [action.payload.defaultValue] The value that will populate the newly created column.
	 */
	changeGridWidth: createGridActionSA(gridBeforeEach, (
		state,
		action: PayloadAction<GridPayloads.ChangeGridWidthPayload>
	) => {
		const {newWidth, defaultValue, gridIndex} = action.payload;
		if (newWidth < 2) {
			return;
		}
		if (newWidth > state[gridIndex].width) {
			//Iterate through each row of the grid
			for (let i = 0; i < state[gridIndex].height; i++) {
				//Iterate through each newly added column
				for (let newCols = 0; newCols < newWidth - state[gridIndex].width; newCols++) {
					state[gridIndex].cells[i].push({
						data: defaultValue ? defaultValue : 0,
						status: "UNEXPLORED",
					});
				}
			}

		} else if (newWidth < state[gridIndex].width) {
			//For each row
			for (let i = 0; i < state[gridIndex].height; i++) {
				//for each destroyed column
				for (let destroyedCols = 0; destroyedCols < state[gridIndex].width - newWidth; destroyedCols++) {
					state[gridIndex].cells[i].pop();
				}
			}
		}
		state[gridIndex].width = newWidth;	
	}),
	/**
	 * Changes the height of the grid, adding new rows below the last existing row.low.
	 */
	changeGridHeight: createGridActionSA(gridBeforeEach, (
		state, 
		action: PayloadAction<GridPayloads.ChangeGridHeightPayload>
	) => {
		const {newHeight, defaultValue, defaultStatus, gridIndex} = action.payload;
		if (!isValidIndex(state.length, gridIndex) || newHeight < 2) {
			return;
		}
		const dummyCell: Cell = {
			data: defaultValue ? defaultValue : 0,
			status: defaultStatus ? defaultStatus : "UNEXPLORED"
		}

		if (newHeight > state[gridIndex].height) {
			for (let i = 0; i < newHeight - state[gridIndex].height; i++) {
				let newArr = new Array(state[gridIndex].width).fill(dummyCell);
				state[gridIndex].cells.push(newArr);
			}       
		} else if (newHeight < state[gridIndex].height) {
			for (let i = 0; i < state[gridIndex].height - newHeight; i++) {
				state[gridIndex].cells.pop()
			}
		}
		state[gridIndex].height = newHeight;
	}),
	/**
	 * Replace the data in each cell with default data and status values.
	 * @param {RootState} state 
	 *  The current state of the Redux store
	 * @param {PayloadAction<ClearGridCellsPayload>} action  
	 *  Redux PayloadAction containing the params below.
	 * @param {number} action.payload.gridIndex 
	 *  The grid in the grid list to be operated on.
	 * @param {number} [action.payload.defaultValue] 
	 *  Value that will replace existing values in each cell.
	 * @param {CellStatus} [action.payload.defaultStatus] 
	 *  Cell Status that will replace existing cell status in each cell.
	 */
	clearGridCells: (
		state: RootState["grids"], 
		action: PayloadAction<GridPayloads.ClearGridCellsPayload>
	) => {
		const {gridIndex, defaultValue, defaultStatus} = action.payload;
		if (!isValidIndex(state.length, gridIndex)) {
			return;
		}
		for (let i = 0; i < state[gridIndex].cells.length; i++) {
			for (let j = 0; j < state[gridIndex].cells[0].length; j++) {
				state[gridIndex].cells[i][j] = {
					data: defaultValue ? defaultValue : 0,
					status: defaultStatus ? defaultStatus: "UNEXPLORED"
				}
			}
		}
	},
	/**
	 * Replace the data in each cell with default data and status values.
	 * @param {RootState} state 
	 *  The current state of the Redux store
	 * @param {PayloadAction<ChangeGridCellPayload>} action  
	 *  Redux PayloadAction containing the params below.
	 * @param {number} action.payload.gridIndex 
	 *  The grid in the grid list to be operated on.
	 * @param {number} [action.payload.row] 
	 *  Row in the grid to operate on.
	 * @param {number} [action.payload.col] 
	 *  Column in the grid to operate on.
	 * @param {data} [action.payload.data]
	 *  Data to put in the selected cell.
	 * @param {status} [action.payload.status]
	 *  Status to apply to the selected cell.
	 */
	changeGridCell: (state: RootState["grids"], action: PayloadAction<GridPayloads.ChangeGridCellPayload>) => {
		const {gridIndex, row, col, data, status} = action.payload;
		if (!isValidIndex(state.length, gridIndex)|| row >= state[gridIndex].height || 
			col >= state[gridIndex].width || row < 0 || col < 0 ||
			data === null || data === undefined
		) {
			return;
		}
		state[gridIndex].cells[row][col] = {data: data, status: status}
		if (status === "START") {
			state[gridIndex].startNodeRow = row;
			state[gridIndex].startNodeCol = col;
			console.log("start set")
			return;
		}
		if (status === "END") {
			state[gridIndex].endNodeRow = row;
			state[gridIndex].endNodeCol = col; 
		}
	},
	clearGridRow: (state: RootState["grids"], action: PayloadAction<GridPayloads.ClearGridRowPayload>) => {
		const {gridIndex, row, data, status} = action.payload;
		if (!isValidIndex(state.length, gridIndex)) {
			return;
		}
		for (let i = 0; i < state[gridIndex].cells[0].length; i++) {
			state[gridIndex].cells[row][i] = {
				data: data,
				status: status,
			}
		}
	},
	/**
	 * Replace the data in each cell with default data and status values.
	 * @param {RootState} state 
	 *  The current state of the Redux store
	 * @param {PayloadAction<ChangeGridCellPayload>} action  
	 *  Redux PayloadAction containing the params below.
	 * @param {number} action.payload.gridIndex 
	 *  The grid in the grid list to be operated on.
	 * @param {number} [action.payload.row] 
	 *  Row in the grid to operate on.
	 * @param {number} [action.payload.col] 
	 *  Column in the grid to operate on.
	 * @param {status} [action.payload.status]
	 *  Status to apply to the selected cell.
	 */
	changeGridCellStatus: (state: RootState["grids"], action: PayloadAction<GridPayloads.ChangeGridCellStatusPayload>) => {
		const {gridIndex, row, col, status} = action.payload;
		if (!isValidIndex(state.length, gridIndex) || row >= state[gridIndex].height || col >= state[gridIndex].width || row < 0 || col < 0) {
			return;
		}
		state[gridIndex].cells[row][col].status = status;
	},
	changeGridCellData: (state: RootState["grids"], action: PayloadAction<GridPayloads.ChangeGridCellDataPayload>) => {
		const {gridIndex, data, row, col} = action.payload;
		if (!isValidIndex(state.length, gridIndex) || row >= state[gridIndex].height || col >= state[gridIndex].width || row < 0 || col < 0) {
			return;
		}
		state[gridIndex].cells[row][col].data = data;
	},
	/**
	 * Replace the data in each cell with default data and status values.
	 * @param {RootState} state 
	 *  The current state of the Redux store
	 * @param {PayloadAction<ChangeGridLabelPayload>} action  
	 *  Redux PayloadAction containing the params below.
	 * @param {number} action.payload.gridIndex
	 *  The grid in the grid list to be operated on.
	 * @param {string} action.payload.label 
	 *  New label for the selected grid data structure.
	 */
	changeGridLabel: (state: RootState["grids"], action: PayloadAction<GridPayloads.ChangeGridLabelPayload>) => {
		const {gridIndex, label} = action.payload;
		if (!isValidIndex(state.length, gridIndex) || gridIndex >= state.length || gridIndex < 0) {
			return;
		}
		state[gridIndex].label = label;
	},
	changeGridCellSize: (state: RootState["grids"], action: PayloadAction<GridPayloads.ChangeGridCellSizePayload>) => {
		const {width, height, gridIndex} = action.payload;
		if (!isValidIndex(state.length, gridIndex)) {
			return;
		}
		state[gridIndex].cellStyleWidth = width;
		state[gridIndex].cellStyleHeight = height;
	}
}

//#endregion

// #region Grid Slice with side effect actions
const gridsSlice = createSlice({
	name: "grids",
	initialState, 
	reducers: gridsReducerObject,
	extraReducers: (builder) => {
		builder.addCase(addGrid, (
		   state: RootState["grids"],
		   action: PayloadAction<AddGridPayload>
	   ) => {
		   const {num} = action.payload;
		   let prevLength = state.length;
		   for (let i = 0; i < num; i++) {
			   prevLength += 1;
			   const newGrid: GridDS = {
				   type: "GRID",
				   indexInList: (prevLength - 1) + i,
				   label: `Grid ${prevLength + i}`,
				   cells: defaultGrid,
				   cellStyleHeight: 50,
				   cellStyleWidth: 50,
				   width: defaultGrid[0].length,
				   height: defaultGrid.length
			   };
			   state.push(newGrid);
		   }
	   }).addCase(deleteGrid, (
		   state: RootState["grids"], 
		   action: PayloadAction<DeleteGridPayload>
	   ) => {
		   const {num} = action.payload;
		   if (num <= 0) {
			   return state;
		   }
		   if (num >= state.length) {
				return [];
		   }
		   for (let i = 0; i < num; i++) {
				state.pop();
		   }
	   }).addCase(deleteGridAt, (
		   state: RootState["grids"], 
		   action: PayloadAction<DeleteGridAtPayload>
	   ) => {
		   const {idx} = action.payload;
		   if (idx >= state.length || idx < (state.length * - 1)) {
			   return;
		   }
		   const effectiveIndex = idx >= 0 ? idx : state.length - (idx * -1);
		   if (effectiveIndex === state.length - 1) {
			   state = [...state.slice(0, state.length - 1)]
			   return;
		   } else {
			   state[effectiveIndex + 1].indexInList -= 1;
			   state = [...state.slice(0, effectiveIndex), ...state.slice(effectiveIndex + 1)];
			   return;    
		   }
	   }).addCase(copyGrid, (
		state: RootState["grids"],
		action: PayloadAction<CopyGridPayload>
	   ) => {
		const {cells} = action.payload;
		let prevLength = state.length;
		const newGrid: GridDS = {
			type: "GRID",
			indexInList: (prevLength),
			label: `Grid ${prevLength + 1}`,
			cells: cells,
			cellStyleHeight: 50,
			cellStyleWidth: 50,
			width: cells[0].length,
			height: cells.length
		};
		state.push(newGrid);
	   })
	}
}) 

//#endregion


export const gridsReducer = gridsSlice.reducer 

export const {
	changeGridCell,
	changeGridCellSize,
	changeGridHeight,
	changeGridLabel,
	changeGridWidth,
	clearGridCells,
	changeGridCellStatus,
	changeGridCellData,
	clearGridRow
} = gridsSlice.actions

export const selectAllGrids = (
	state: RootState
) => state.grids;

//#region Grid Thunk Actions
type AppThunk = ThunkAction<void, any, unknown, Action<string>>

export const changeGridLabels = (startIndex: number, labels: string[]): AppThunk => {
	return (
		dispatch,
		getState
	) => {
		let grids = getState().grids;
		if (startIndex < 0 || startIndex >= grids.length) {
			return;
		}
		let labelBoundary = 0;
		if (startIndex + labels.length >= grids.length) {
			labelBoundary = startIndex + labels.length;
		} else {
			labelBoundary = grids.length;
		}
		let labelIndex = 0;
		for (let i = startIndex; i < labelBoundary; i++) {
			dispatch(changeGridLabel({gridIndex: i, label: labels[labelIndex]}));
			labelIndex++;
		}
	}
}

export const copyGrids = (grids: Cell[][][]): AppThunk => {
	return (
		dispatch, 
		getState
	) => {
		for (let i = 0; i < grids.length; i++) {
			dispatch(copyGrid({cells: grids[i]}));
		}
	}
}

export const floodFill = (gridIndex: number): AppThunk => {
	return (
		dispatch, 
		getState
	) => {
		const dfs = (row: number, col: number, oldColor: number, newColor: number) => {
			let grid = getState().grids[gridIndex]
			if (row < 0 || col < 0 || row >= grid.height || col >= grid.width || grid.cells[row][col].data !== oldColor) {
				return;
			}
			dispatch(changeGridCell({gridIndex: gridIndex, row: row, col: col, data: newColor, status: "EXPLORED"}));
			dfs(row + 1, col, oldColor, newColor);
			dfs(row - 1, col, oldColor, newColor);
			dfs(row, col + 1, oldColor, newColor);
			dfs(row, col - 1, oldColor, newColor);
		}
		dfs(0, 0, 1, 2);
	}
}

//#endregion
