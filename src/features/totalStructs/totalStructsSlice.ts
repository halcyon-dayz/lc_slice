/* eslint-disable no-lone-blocks */
import {createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../utils/types"

import { PayloadAction } from "@reduxjs/toolkit";

import { 
    AddArrayPayload, 
    addArray, 
    deleteArray,
    DeleteArrayPayload,
    AddGridPayload, 
    addGrid,
    DeleteGridPayload,
    deleteGrid
} from "../sharedActions";

const initialState: RootState["totalStructs"] = 1;

const totalStructsSlice = createSlice({
    name: "dataStructure",
    initialState, 
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addArray, (state, action: PayloadAction<AddArrayPayload>) => {
            const {num} = action.payload;
            return state + num;
        }).addCase(deleteArray, (state, action: PayloadAction<DeleteArrayPayload>) => {
            const {num} = action.payload;
            if (num >= state) {
                state = 0;
                return;
            }
            state -= num;
        }).addCase(addGrid, (state, action: PayloadAction<AddGridPayload>) => {
            const {num} = action.payload;
            return state + num;
        }).addCase(deleteGrid, (state, action: PayloadAction<DeleteGridPayload>) => {
            const {num} = action.payload;
            if (num >= state) {
                return 0;
            }
            return state -= num;
        })
    }
}) 

export const totalStructsReducer = totalStructsSlice.reducer
export const selectTotalStructs = (state: RootState) => state.totalStructs;