import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../utils/types"
import { addArray, AddArrayPayload, deleteArray, DeleteArrayPayload} from "../sharedActions";

import * as ArrayPayloads from "./arrayPayloads"


const initialState: RootState["arrays"] = [];

const arraysSlice = createSlice({
    name: "arrays",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(deleteArray, (state, action: PayloadAction<DeleteArrayPayload>) => {
            const {num} = action.payload;
            if (num <= 0) {
                return;
            }
            if (num > state.length) {
                return [];
            }
            for (let i = 0; i < num; i++) {
                state.pop();
            } 
        }).addCase(addArray, (state, action: PayloadAction<AddArrayPayload>) => {
            const {num} = action.payload;
            for (let i = 0; i < num; i++) {
                state.push({
                    data: [
                        {
                            data: 1,
                            status: "UNEXPLORED"
                        },
                        {
                            data: 2,
                            status: "UNEXPLORED"
                        },
                        {
                            data: 3,
                            status: "UNEXPLORED"
                        },
                        {
                            data: 4,
                            status: "UNEXPLORED"
                        },
                        {
                            data: 5,
                            status: "UNEXPLORED"
                        },
                    ],
                    pointerLocations: [0, 1],
                    width: 5,
                    type: "ARRAY",
                });
            }
        })
    }
})

export const arraysReducer = arraysSlice.reducer

export const selectAllArrays = (state: RootState) => state.arrays;