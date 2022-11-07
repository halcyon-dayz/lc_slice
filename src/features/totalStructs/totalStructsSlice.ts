// #region Total Structs Imports
import {createSlice, Action} from "@reduxjs/toolkit";
import {RootState} from "../../utils/types"

import { PayloadAction } from "@reduxjs/toolkit";
import { ThunkAction } from "@reduxjs/toolkit";

import { 
    AddArrayPayload, 
    addArray, 
    deleteArray,
    DeleteArrayPayload,
    AddGridPayload, 
    addGrid,
    DeleteGridPayload,
    deleteGrid,
    copyGrid,
    CopyGridPayload
} from "../sharedActions";

//#endregion

const initialState: RootState["totalStructs"] = 0;


//#region Total Structs Slice and Side Effects
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
        }).addCase(copyGrid, (state, action: PayloadAction<CopyGridPayload>) => {
            return state + 1;
        })
    }
}) 

//#endregion

type AppThunk = ThunkAction<void, any, unknown, Action<string>>
export const deleteAllStructs = (): AppThunk => {
    return (
        dispatch,
        getState
    ) => {
        let grids = getState().grids;
        let arrays = getState().arrays;
        dispatch(deleteGrid({num: grids.length}));
        dispatch(deleteArray({num: arrays.length}));

    }
}

export const totalStructsReducer = totalStructsSlice.reducer
export const selectTotalStructs = (state: RootState) => state.totalStructs;