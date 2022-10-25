import {createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../utils/types";

import { PayloadAction } from "@reduxjs/toolkit";
import { Cell, CellStatus} from "../../utils/types";


import { ThunkAction} from "@reduxjs/toolkit";
import { Action } from "@reduxjs/toolkit";
//Default Cell value
const dfCell: Cell = {
    data: 0,
    status: "UNEXPLORED"
}

const defaultArray: Cell[][] = [
    [dfCell, dfCell, dfCell, dfCell, dfCell],
    [dfCell, dfCell, dfCell, dfCell, dfCell],
    [dfCell, dfCell, dfCell, dfCell, dfCell],
    [dfCell, dfCell, dfCell, dfCell, dfCell],
    [dfCell, dfCell, dfCell, dfCell, dfCell]
]


const initialState: RootState["grid"] = {
    type: "GRID",
    width: 5,
    height: 5,
    cells: defaultArray,
    label: "Grid #1",
    cellStyleWidth: 50,
    cellStyleHeight: 50,
}

type ChangeWidthPayload = {
    newWidth: number,
    dummyVal?: any
}

type ChangeHeightPayload = {
    newHeight: number,
    dummyVal?: any
}

type ChangeCellPayload = {
    row: number,
    col: number,
    data: number,
    status: CellStatus
}

type ChangeCellSizePayload = {
    width: number,
    height: number
}

type FloodFillPayload = {
    startRow: number,
    startCol: number,
    oldColor: number,
    newColor: number
}



const gridSlice = createSlice({
    name: "grid",
    initialState, 
    reducers: {
        changeWidth: (state, action: PayloadAction<ChangeWidthPayload>) => {
            const {newWidth, dummyVal} = action.payload;
            if (newWidth < 2) {
                return;
            }
            if (newWidth > state.width) {
                for (let i = 0; i < state.height; i++) {
                    state.cells[i].push({
                        data: dummyVal ? dummyVal : 0,
                        status: "UNEXPLORED",
                    });
                }
            } else if (newWidth < state.width) {
                for (let i = 0; i < state.height; i++) {
                    state.cells[i].pop();
                }
            }
            state.width = newWidth;
        },
        changeHeight: (state, action: PayloadAction<ChangeHeightPayload>) => {
            const {newHeight, dummyVal} = action.payload;
            const dummyCell: Cell = {
                data: dummyVal ? dummyVal : 0,
                status: "UNEXPLORED",
            }
            if (newHeight < 2) {
                return;
            }
            if (newHeight > state.height) {
                for (let i = 0; i < newHeight - state.height; i++) {
                    let newArr = new Array(state.width).fill(dummyCell);
                    state.cells.push(newArr);
                }       
            } else if (newHeight < state.height) {
                for (let i = 0; i < state.height - newHeight; i++) {
                    state.cells.pop()
                }
            }
            state.height = newHeight;
        },
        clearCells: (state, action: PayloadAction<any>) => {
            for (let i = 0; i < state.cells.length; i++) {
                for (let j = 0; j < state.cells[0].length; j++) {
                    state.cells[i][j] = action.payload
                }
            }
        },
        changeCell: (state, action: PayloadAction<ChangeCellPayload>) => {
            const {row, col, data, status} = action.payload;
            if (row >= state.height || col >= state.width || row < 0 || col < 0) {
                return;
            }
            /* if ((state.startNodeRow !== undefined && status === "START") || (state.endNodeRow !== undefined && status === "END")) {
                console.log("no")
                return;
            } */
            state.cells[row][col] = {data: data, status: status}
            if (status === "START") {
                state.startNodeRow = row;
                state.startNodeCol = col;
                console.log("start set")
                return;
            }
            if (status === "END") {
                state.endNodeRow = row;
                state.endNodeCol = col; 
            }
        },
        changeLabel: (state, action: PayloadAction<string>) => {
            state.label = action.payload;
        },
        changeCellSize: (state, action: PayloadAction<ChangeCellSizePayload>) => {
            const {width, height} = action.payload;
            state.cellStyleWidth = width;
            state.cellStyleHeight = height;
        },
        floodFillGrid: (state, action: PayloadAction<FloodFillPayload>) => {
            const {startRow, startCol, newColor} = action.payload;
            if (state.cells[startRow][startCol].data === newColor) {
                return;
            }
            return state;      
        }

    }

}) 



export const grid = gridSlice.reducer 

export const {
    changeWidth,
    changeHeight,
    clearCells,
    changeCell,
    changeLabel,
    changeCellSize
} = gridSlice.actions

export const gridSelector = (state: RootState) => state.grid;

type AppThunk = ThunkAction<void, any, unknown, Action<string>>


export const floodFill = (): AppThunk => {
    return (
        dispatch, 
        getState
    ) => {
        const dfs = (row: number, col: number, oldColor: number, newColor: number) => {
            let grid = getState().grid;
            if (row < 0 || col < 0 || row >= grid.height || col >= grid.width || grid.cells[row][col].data !== oldColor) {
                return;
            }
            dispatch(changeCell({row: row, col: col, data: newColor, status: "EXPLORED"}));
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