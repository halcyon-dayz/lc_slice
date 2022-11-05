import { RootState } from "../../utils/types";
import {PayloadAction} from "@reduxjs/toolkit"

/* Grid Utility Functions */
export const isValidIndex = (stateLength: number, index: number): boolean => {
	if (stateLength === 0 || index >= stateLength || index < 0) {
		return false;
	}
	return true;
}

export const isStateValid = (stateLength: number) => {
	if (stateLength === 0) {
		return false;
	}
	return true;
}

/* Grid Slice Type Helpers */
export type GridBeforeEachFunc = (state: RootState["grids"], action?: PayloadAction<any>) => boolean;
export type GridDuringWithActionFunc = (state: RootState["grids"], action: PayloadAction<any>) => void
export type GridDuringFunc = (state: RootState["grids"]) => void;


/* Grid Slice Action Creators */
export const createGridActionSA = (beforeEach: GridBeforeEachFunc, during: GridDuringWithActionFunc) => {
	return (state: RootState["grids"], action: PayloadAction<any>) => {
		const beforeTest = beforeEach(state, action);
		console.log("before test ran")
		console.log(state.length);
		if (!beforeTest) {
			return;
		}
		during(state, action);
	}
}

export const createGridActionS = (beforeEach: GridBeforeEachFunc, during: GridDuringFunc) => {
	return (state: RootState["grids"]) => {
		const beforeTest = beforeEach(state);
		console.log("before test ran")
		console.log("state.length");
		if (!beforeTest) {
			return;
		}
		during(state);
	}
}