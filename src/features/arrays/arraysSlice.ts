import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CellStatus, RootState} from "../../utils/types"
import { addArray, AddArrayPayload, copyArray, CopyArrayPayload, deleteAllStructs, deleteArray, DeleteArrayPayload} from "../sharedActions";
import { ArrayBeforeEachFunc, createArrayActionSA, indexExistsOnArray } from "./arrayUtils";
import { isValidIndex, isStateValid} from "../featureUtils"
import { Cell, ArrDS} from "../../utils/types";

import * as ArrayPayloads from "./arrayPayloads"


const initialState: RootState["arrays"] = [];

const checkArrayExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
	const result = action ? ( isValidIndex(state.length, action.payload.gridIndex) ) : (isStateValid(state.length))
    return result;
}

const checkIndexExists: ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => {
    return action ? ( indexExistsOnArray(state[action.payload.gridIndex].data, action.payload.index) ) : false;
}


const arraysReducerObject = {
    pushDataAtIndex: createArrayActionSA(
        [checkArrayExists, checkIndexExists], 
        (state: RootState["arrays"], action: PayloadAction<ArrayPayloads.PushDataAtIndexPayload>) => 
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
        state[arrayIndex].width += newData.length;
        return;
    }),
    /**
	 * Push data to the end of the array
	 * @param {number} arrayIndex 
	 *  The array in the array list to operate on.
	 * @param {any[]} data
	 *  Data to push into the array.
	 */
    pushData: createArrayActionSA(
        [checkArrayExists],
        (state: RootState["arrays"], action: PayloadAction<ArrayPayloads.PushDataPayload>) => 
    {
        const {arrayIndex, data} = action.payload;
        const pushArray: Cell[] = data.map((D) => {
            return {data: D, status: "UNEXPLORED"}
        })
        state[arrayIndex].width += data.length;
        state[arrayIndex].data.push(...pushArray);
        return;
    }),
    /**
	 * Pop data from the end of the array.
	 * @param {number} arrayIndex 
	 *  The array in the array list to operate on.
	 * @param {number} num
	 *  The number of elements to pop off the array.
	 */
    popData: createArrayActionSA(
        [checkArrayExists],
        (state: RootState["arrays"], action: PayloadAction<ArrayPayloads.PopDataPayload>) => 
    {
        const {arrayIndex, num} = action.payload;
        if (num <= 0) {
            return;
        }
        if (num >= state[arrayIndex].data.length) {
            state[arrayIndex].data = [];
            return;
        }
        state[arrayIndex].width -= num;
        for (let i = 0; i < num; i++) {
            state[arrayIndex].data.pop();
        }
        return;
    }),
    addPointer: createArrayActionSA(
        [checkArrayExists],
        (state: RootState["arrays"], action: PayloadAction<ArrayPayloads.AddPointerPayload>) => {
            const {arrayIndex, location} = action.payload;
            if (location && location > 0 && location < state[arrayIndex].data.length) {
                state[arrayIndex].pointerLocations.push(location);
            } else {
                console.log(state[arrayIndex].pointerLocations);
                state[arrayIndex].pointerLocations.push(0);
            }
        }
    ),
    movePointer: createArrayActionSA(
        [checkArrayExists],
        (state: RootState["arrays"], action: PayloadAction<ArrayPayloads.MovePointerPayload>) => {
            const {arrayIndex, pointerIndex, newLocation} = action.payload;
            if (state[arrayIndex].pointerLocations.length <= 0) {
                return;
            }
            if (pointerIndex < 0 || pointerIndex >= state[arrayIndex].pointerLocations.length) {
                return;
            }
            if (newLocation < 0 || newLocation >= state[arrayIndex].data.length) {
                return;
            }
            state[arrayIndex].pointerLocations[pointerIndex] = newLocation;
        }
    ) 
}

const arraysSlice = createSlice({
    name: "arrays",
    initialState,
    reducers: arraysReducerObject,
    extraReducers: (builder) => {
        builder.addCase(addArray, (
            state: RootState["arrays"], 
            action: PayloadAction<AddArrayPayload>
        ) => {
            const {num} = action.payload;
            for (let i = 0; i < num; i++) {
                state.push({
                    data: [
                        {
                            data: 0,
                            status: "UNEXPLORED"
                        },
                    ],
                    pointerLocations: [],
                    width: 1,
                    type: "ARRAY",
                });
            }
        }).addCase(deleteArray, (
            state: RootState["arrays"], 
            action: PayloadAction<DeleteArrayPayload>
        ) => {
            const {num} = action.payload;
            if (num >= state.length) {
                return [];
            }
            if (num <= 0) {
                return state;
            }
            for (let i = 0; i < num; i++) {
                state.pop();
            }
        }).addCase(copyArray, (
            state: RootState["arrays"], 
            action: PayloadAction<CopyArrayPayload>
        ) => {
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
        }).addCase(deleteAllStructs, (
            state: RootState["arrays"]
        ) => {
            return [];
        })
    }
})

export const arraysReducer = arraysSlice.reducer

export const {
    pushData,
    pushDataAtIndex,
    popData,
    movePointer,
    addPointer,
} = arraysSlice.actions

export const selectAllArrays = (state: RootState) => state.arrays;