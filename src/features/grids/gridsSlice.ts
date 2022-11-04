import {createSlice } from "@reduxjs/toolkit";
import {RootState, Cell, GridDS} from "../../utils/types"
import { GRID_417_PACIFIC_ATLANTIC_WATER_FLOW_GRID } from "./defaultGrids";

import { PayloadAction } from "@reduxjs/toolkit";
import { 
	ChangeGridWidthPayload,
	ChangeGridHeightPayload,
	ChangeGridCellPayload,
	ChangeGridCellSizePayload,
	ClearGridCellsPayload,
	ChangeGridLabelPayload,
	ChangeGridCellStatusPayload,
	ClearGridRowPayload,
	ChangeGridCellDataPayload
} from "./gridPayloads";

import {
	addGrid,
	AddGridPayload,
	deleteGrid,
	DeleteGridPayload,
	deleteGridAt,
	DeleteGridAtPayload,
	deleteAllGrids,
	copyGrid,
	CopyGridPayload
} from "../sharedActions"

import { ThunkAction} from "@reduxjs/toolkit";
import { Action } from "@reduxjs/toolkit";
import {defaultGrid} from "../../utils/defaultData";
//Default Cell value

const initialState: RootState["grids"] = [{
	type: "GRID",
	indexInList: 0,
	width: 5,
	height: 5,
	cells: defaultGrid,
	label: "Grid #1",
	cellStyleWidth: 50,
	cellStyleHeight: 50,
}]

const isValidIndex = (stateLength: number, index: number): boolean => {
	if (stateLength === 0 || index >= stateLength || index < 0) {
		return false;
	}
	return true;

}

const gridsSlice = createSlice({
	name: "grids",
	initialState, 
	reducers: {
		/**
		 * Changes the width of the grid, adding a new column to each row.
		 * @param {RootState} state The current state of the Redux store.
		 * @param {PayloadAction<ChangeGridWidthPayload>} action  Redux PayloadAction containing the params below.
		 * @param {number} action.payload.gridIndex The grid in the grid list to be operated on.
		 * @param {number} action.payload.newWidth The new width (num. columns) of the grid.
		 * @param {number} [action.payload.defaultValue] The value that will populate the newly created column.
		 */
		changeGridWidth: (
			state, 
			action: PayloadAction<ChangeGridWidthPayload>
		) => {
			const {newWidth, defaultValue, gridIndex} = action.payload;
			if (!isValidIndex(state.length, gridIndex) || newWidth < 2) {
				return;
			}
			if (newWidth > state[gridIndex].width) {
				for (let i = 0; i < state[gridIndex].height; i++) {
					state[gridIndex].cells[i].push({
						data: defaultValue ? defaultValue : 0,
						status: "UNEXPLORED",
					});
				}
			} else if (newWidth < state[gridIndex].width) {
				for (let i = 0; i < state[gridIndex].height; i++) {
					state[gridIndex].cells[i].pop();
				}
			}
			state[gridIndex].width = newWidth;
		},
		/**
		 * Changes the height of the grid, adding new rows below the last existing row.
		 * @param {RootState} state The current state of the Redux store.
		 * @param {PayloadAction<ChangeGridHeightPayload>} action  Redux PayloadAction containing the params below.
		 * @param {number} action.payload.gridIndex The grid in the grid list to be operated on.
		 * @param {number} action.payload.newHeight The new height (num. rows) of the grid.
		 * @param {number} [action.payload.defaultValue] The value that will populate each cell in every new row.
		 */
		changeGridHeight: (state, action: PayloadAction<ChangeGridHeightPayload>) => {
			const {newHeight, defaultValue, gridIndex} = action.payload;
			if (!isValidIndex(state.length, gridIndex) || newHeight < 2) {
				return;
			}
			const dummyCell: Cell = {
				data: defaultValue ? defaultValue : 0,
				status: "UNEXPLORED",
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
		},
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
		clearGridCells: (state, action: PayloadAction<ClearGridCellsPayload>) => {
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
		changeGridCell: (state, action: PayloadAction<ChangeGridCellPayload>) => {
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
		clearGridRow: (state, action: PayloadAction<ClearGridRowPayload>) => {
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
		changeGridCellStatus: (state, action: PayloadAction<ChangeGridCellStatusPayload>) => {
			const {gridIndex, row, col, status} = action.payload;
			if (!isValidIndex(state.length, gridIndex) || row >= state[gridIndex].height || col >= state[gridIndex].width || row < 0 || col < 0) {
				return;
			}
			state[gridIndex].cells[row][col].status = status;
		},
		changeGridCellData: (state, action: PayloadAction<ChangeGridCellDataPayload>) => {
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
		changeGridLabel: (state, action: PayloadAction<ChangeGridLabelPayload>) => {
			const {gridIndex, label} = action.payload;
			if (!isValidIndex(state.length, gridIndex) || gridIndex >= state.length || gridIndex < 0) {
				return;
			}
			state[gridIndex].label = label;
		},
		changeGridCellSize: (state, action: PayloadAction<ChangeGridCellSizePayload>) => {
			const {width, height, gridIndex} = action.payload;
			state[gridIndex].cellStyleWidth = width;
			state[gridIndex].cellStyleHeight = height;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(addGrid, (
		   state,
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
	   }).addCase(deleteAllGrids, (
		   state
	   ) => {
		   for (let i = 0; i < state.length; i++) {
			state.pop();
		   }
	   }).addCase(deleteGrid, (
		   state, 
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
		   state, 
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
		state,
		action: PayloadAction<CopyGridPayload>
	   ) => {
		state.pop();
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

type AppThunk = ThunkAction<void, any, unknown, Action<string>>

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

/* export const floodFillBFS = (): AppThunk => {
	return (
		dispatch,
		getState
	) => {
		const bfs = (row: number, col: number, oldColor: number, newColor: number) => {

		}
	}
} */


/* export const saveProject = createAsyncThunk(
	"SAVE_PROJECT",
	async (
	  { projectName, thumbnail }: SaveProjectArg,
	  { getState }
	) => {
	  try {
		const response = await newProject(
		  projectName,
		  (getState() as RootState)?.strokes,
		  thumbnail
		)
		console.log(response)
	  } catch (err) {
		console.log(err)
	  }
	}
  )

  export const newProject = (
  name: string,
  strokes: Stroke[],
  image: string
) =>
  fetch("http://localhost:4000/projects/new", {
	method: "POST",
	headers: {
	  Accept: "application/json",
	  "Content-Type": "application/json"
	},
	body: JSON.stringify({
	  name,
	  strokes,
	  image
	})
  }).then((res) => res.json())

export const getProject = (projectId: string) => {
  return fetch(`http://localhost:4000/projects/${projectId}`).then(
	(res) => res.json()
  )
} */
