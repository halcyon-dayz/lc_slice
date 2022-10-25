/* eslint-disable no-lone-blocks */
import {createSlice } from "@reduxjs/toolkit";
import {ArrDS, CellStatus, DataStructures, GridDS, RootState} from "../../utils/types"
import { defaultGrid, defaultGridCell, defaultArray} from "../../utils/defaultData";

import { PayloadAction } from "@reduxjs/toolkit";
import { Cell} from "../../utils/types";


import { DataStructureType } from "../../utils/types";
//Default Cell value




const initialState: RootState["dataStructures"] = {
    grids: [],
    arrays: [],
    totalStructs: 0
}

type AddArrayPayload = {
    label: string,
    data?: Cell[]
}

type AddGridPayload = {
    label: string,
    width: number,
    height: number,
    defaultValue?: number,
    defaultStatus?: CellStatus
}

type ChangeWidthPayload = {
    type: DataStructureType,
    index: number,
    width: number,
    data?: number
}

type ChangeArrayLabelPayload = {
    idx: number,
    label: string
}

type ChangeArrayWidthPayload = {
    idx: number,
    width: number,
    defaultValue?: number
}

type ChangeGridLabelPayload = {
    idx: number,
    label: string
}


const dataStructuresSlice = createSlice({
    name: "dataStructure",
    initialState, 
    reducers: {
        addArray: (
            state, 
            action: PayloadAction<AddArrayPayload>
        ) => {
            const {label, data} = action.payload;
            state.arrays.push({
                type: "ARRAY", 
                label: label, 
                data: data ? data : defaultArray,
                width: data ? data.length : defaultArray.length
            })
        },
        addGrid: (
            state, 
            action: PayloadAction<AddGridPayload>
        ) => {
            const {label, width, height, defaultValue, defaultStatus} = action.payload;
            const cell: Cell = {
                data: defaultValue ? defaultValue : 0,
                status: defaultStatus ? defaultStatus: "UNEXPLORED"
            }
            const gd = [];
            for (let i = 0; i < height; i++) {
                let row = [];
                for (let j = 0; j < width; j++) {
                    row.push(cell);
                }
                gd.push(row);             
            }
            state.grids.push({
                type: "GRID",
                label: label,
                width: width,
                height: height,
                cells: gd,
                cellStyleWidth: 50,
                cellStyleHeight: 50
            })
        },
        changeArrayWidth: (
            state,
            action: PayloadAction<ChangeArrayWidthPayload>
        ) => {
            const {width, idx, defaultValue} = action.payload;
            if (idx < 0 || idx >= state.arrays.length || width === state.arrays.length) {
                return;
            }
            const dfValue = defaultValue ? defaultValue : 0
            let diff = state.arrays.length - width;
            if (width < state.arrays.length) {
                for (let i = 0; i < diff; i++) {
                    state.arrays[idx].data.pop();                 
                }
            } else {
                diff = diff * -1;
                for (let i = 0; i < diff; i++) {
                    state.arrays[idx].data.push({status: "NO_DATA", data: dfValue})
                }
            }
        },
        changeArrayLabel: (
            state, 
            action: PayloadAction<ChangeArrayLabelPayload>
        ) => {
            const {label, idx} = action.payload;
            if (idx < 0 || idx >= state.arrays.length) {
                return;
            }
            state.arrays[idx].label = label;
        },
        changeGridLabel: (
            state,
            action: PayloadAction<ChangeGridLabelPayload>
        ) => {
            const {label, idx} = action.payload;
            if (idx < 0 || idx >= state.grids.length) {
                return;
            }
            state.grids[idx].label = label;
        }
    }
}) 

export const dataStructuresReducer = dataStructuresSlice.reducer

export const {
    addArray,
    addGrid, 
    changeArrayLabel, 
    changeArrayWidth,
    changeGridLabel
} = dataStructuresSlice.actions

export const selectAllDataStructs = (state: RootState): DataStructures => state.dataStructures
export const selectNumDataStructs = (state: RootState): number => state.dataStructures.totalStructs