import { createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../types"

import { PayloadAction } from "@reduxjs/toolkit";
import { Cell, CellStatus} from "../../types";


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
    data: 0,
    status: CellStatus
}

type ChangeCellSizePayload = {
    width: number,
    height: number
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
            if (row > state.height || col > state.width || row < 0|| col < 0) {
                return;
            }
            if ((state.startNodeRow !== undefined && status === "START") || (state.endNodeRow !== undefined && status === "END")) {
                console.log("no")
                return;
            } 
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
export const gridCellsSelector = (state: RootState, row: number, col: number) => state.grid.cells[row][col];