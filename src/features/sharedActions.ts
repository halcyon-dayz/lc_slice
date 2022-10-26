import {createAction} from "@reduxjs/toolkit"

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

export const addArray = createAction<AddArrayPayload>("addArray");
export const deleteArray = createAction<DeleteArrayPayload>("deleteArray");
export const deleteArrayAt = createAction<DeleteArrayAtPayload>("deleteArrayAt")
export const deleteAllArrays = createAction("deleteAllArrays");
export const addGrid = createAction<AddGridPayload>("addGrid");
export const deleteGrid = createAction<DeleteGridPayload>("deleteGrid");
export const deleteAllGrids = createAction("deleteAllGrids");
export const deleteGridAt = createAction<DeleteGridAtPayload>("deleteGridAt");