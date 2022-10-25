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

export const addArray = createAction<AddArrayPayload>("addArray");
export const deleteArray = createAction<DeleteArrayPayload>("deleteArray");
export const addGrid = createAction<AddGridPayload>("addGrid");
export const deleteGrid = createAction<DeleteGridPayload>("deleteGrid");