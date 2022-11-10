import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CellStatus, RootState} from "../../utils/types"
import { addArray, AddArrayPayload, copyArray, CopyArrayPayload, deleteArray, DeleteArrayPayload} from "../sharedActions";
import { ArrayBeforeEachFunc, createArrayActionSA, indexExistsOnArray } from "./arrayUtils";
import { isValidIndex, isStateValid} from "../featureUtils"
import { Cell, ArrDS} from "../../utils/types";

import * as ArrayPayloads from "./arrayPayloads"


const initialState: RootState["arrays"] = [];

const checkArrayExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
	return action ? ( isValidIndex(state.length, action.payload.gridIndex) ) : (isStateValid(state.length))
}

const checkIndexExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
    return action ? ( indexExistsOnArray(state[action.payload.gridIndex].data, action.payload.index) ) : false;
}


const arrayReducerObject = {
    pushDataAtIndex: createArrayActionSA(
        [checkArrayExists, checkIndexExists], 
        (state, action: PayloadAction<ArrayPayloads.PushDataAtIndexPayload>) => 
    {
        const {arrayIndex, index, data, replaceAtIndex} = action.payload;
        const newData: Cell[] = data.map((d) => {
            return {data: d, status: "UNEXPLORED"}
        })
        state[arrayIndex].data = [
            ...state[arrayIndex].data.slice(0, index), 
            ...newData,
            ...state[arrayIndex].data.slice(replaceAtIndex ? index : index + 1)
        ]
        return;
    }),
    pushData: createArrayActionSA(
        [checkArrayExists],
        (state, action: PayloadAction<ArrayPayloads.PushDataPayload>) => 
    {
        const {arrayIndex, data} = action.payload;
        const pushArray: Cell[] = data.map((D) => {
            return {data: D, status: "UNEXPLORED"}
        })
        
        state[arrayIndex].data.push(...pushArray);
        return;
    }),
    popData: createArrayActionSA(
        [checkArrayExists],
        (state, action: PayloadAction<ArrayPayloads.PopDataPayload>) => 
    {
        const {arrayIndex, num} = action.payload;
        if (num <= 0) {
            return;
        }
        if (num >= state[arrayIndex].data.length) {
            state[arrayIndex].data = [];
            return;
        }
        for (let i = 0; i < num; i++) {
            state[arrayIndex].data.pop();
        }
        return;
    })
    
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
        }).addCase(copyArray, (state, action: PayloadAction<CopyArrayPayload>) => {
            const {data} = action.payload;
            const dataArr: Cell[] = data.map((ele) => {
                return {data: ele, status: "UNEXPLORED"}
            })
            const prevLength = state.length;
            const newArrDS: ArrDS = {
                type: "ARRAY",
                label: `Array #${prevLength + 1}`,
                width: data.length,
                data: dataArr,
                pointerLocations: []
            }
            state.push(newArrDS);
        })
    }
})

export const arraysReducer = arraysSlice.reducer

export const {
    pushData,
    pushDataAtIndex,
    popData
} = arraysSlice.actions

export const selectAllArrays = (state: RootState) => state.arrays;