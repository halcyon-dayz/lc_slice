import {createAction} from "@reduxjs/toolkit"
import { Cell } from "../utils/types"

export type AddArrayPayload = {
    num: number
}

export type DeleteArrayPayload = {
    num: number
}

export type DeleteGridPayload = {
    num: number
}

export type AddGridPayload = {
    num: number
}

export type DeleteGridAtPayload = {
    idx: number
}

export type DeleteArrayAtPayload = {
    idx: number
}

export type CopyGridPayload = {
    cells: Cell[][],
}

export const addArray = createAction<AddArrayPayload>("addArray");
export const deleteArray = createAction<DeleteArrayPayload>("deleteArray");
export const deleteArrayAt = createAction<DeleteArrayAtPayload>("deleteArrayAt")
export const deleteAllArrays = createAction("deleteAllArrays");
export const addGrid = createAction<AddGridPayload>("addGrid");
export const copyGrid = createAction<CopyGridPayload>("copyGrid");
export const deleteGrid = createAction<DeleteGridPayload>("deleteGrid");
export const deleteAllGrids = createAction("deleteAllGrids");
export const deleteGridAt = createAction<DeleteGridAtPayload>("deleteGridAt");