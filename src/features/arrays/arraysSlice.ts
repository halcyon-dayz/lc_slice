import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../utils/types"
import { addArray, AddArrayPayload, deleteArray, DeleteArrayPayload} from "../sharedActions";
import { ArrayBeforeEachFunc, createArrayActionSA, indexExistsOnArray } from "./arrayUtils";
import { isValidIndex, isStateValid} from "../featureUtils"

import * as ArrayPayloads from "./arrayPayloads"


const initialState: RootState["arrays"] = [];


const checkArrayExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
	return action ? ( isValidIndex(state.length, action.payload.gridIndex) ) : (isStateValid(state.length))
}

const checkIndexExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
    return action ? ( indexExistsOnArray(state[action.payload.gridIndex].data, action.payload.index) ) : false;
}


const arrayReducerObject = {
    addDataAtIndex: createArrayActionSA(
        [checkArrayExists, checkIndexExists], 
        (state, action: PayloadAction<ArrayPayloads.AddDataAtIndexPayload>) => 
    {
        const {arrayIndex, index, data} = action.payload;
        state[arrayIndex].data[index].data = data;
    }),
    addData: createArrayActionSA(
        [checkArrayExists],
        (state, action: PayloadAction<ArrayPayloads.AddDataPayload>) => 
    {
        const {arrayIndex, data} = action.payload;
        state[arrayIndex].data.push({data: data, status: "UNEXPLORED"})
    }),
    
}

const arraysSlice = createSlice({
    name: "arrays",
    initialState,
    reducers: arrayReducerObject,
    extraReducers: (builder) => {
        builder.addCase(deleteArray, (state, action: PayloadAction<DeleteArrayPayload>) => {
            const {num} = action.payload;
            if (num <= 0) {
                return state;
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