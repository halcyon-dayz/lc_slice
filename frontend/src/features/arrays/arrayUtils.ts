import { RootState } from "../../utils/types";
import { PayloadAction } from "@reduxjs/toolkit";
import {Cell} from "../../utils/types"

export type ArrayBeforeEachFunc = (state: RootState["arrays"], action?: PayloadAction<any>) => boolean;
export type ArrayDuringWithActionFunc = (state: RootState["arrays"], action: PayloadAction<any>) => void
export type ArrayDuringFunc = (state: RootState["arrays"]) => void;

/* Grid Slice Action Creators */
export const createArrayActionSA = (beforeEach: ArrayBeforeEachFunc[], during: ArrayDuringWithActionFunc) => {
	return (state: RootState["arrays"], action: PayloadAction<any>) => {
        for (let i = 0; i < beforeEach.length; i++) {
		    const beforeTest = beforeEach[i](state, action);
		    if (!beforeTest) {
			    return;
		    }
        }
		during(state, action);
	}
}

export const createArrayActionS = (beforeEach: ArrayBeforeEachFunc, during: ArrayDuringFunc) => {
	return (state: RootState["arrays"]) => {
		const beforeTest = beforeEach(state);
		if (!beforeTest) {
			return;
		}
		during(state);
	}
}

export const indexExistsOnArray = (arr: Cell[], index: number): boolean => {
    return (arr.length !== 0 && index >= 0 && index < arr.length);
}