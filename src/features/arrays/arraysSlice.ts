import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../utils/types"


const initialState: RootState["arrays"] = [];

const arraysSlice = createSlice({
    name: "arrays",
    initialState,
    reducers: {
        deleteAllArrays: (
            state
        ) => {
            state = [];
        }
    },
})

export const arraysReducer = arraysSlice.reducer

export const selectAllArrays = (state: RootState) => state.arrays;