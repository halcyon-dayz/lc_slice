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

export type CopyArrayPayload = {
    data: any[],
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

/**
 * Add arrays to the array list
 * @param {number} num
 * The number of arrays to add.
 */
export const addArray = createAction<AddArrayPayload>("addArray");
/**
 * Delete arrays from the array list
 * @param {number} num
 * The number of arrays to remove.
 */
export const deleteArray = createAction<DeleteArrayPayload>("deleteArray");
/**
 * Delete array at a given index in the array list
 * @param {number} idx
 * The index of the array to remove from the array list.
 */
export const deleteArrayAt = createAction<DeleteArrayAtPayload>("deleteArrayAt")
/**
 * Add grids to the grid list
 * @param {number} num
 * The number of grids to add.
 */
export const copyArray = createAction<CopyArrayPayload>("copyArray");
export const addGrid = createAction<AddGridPayload>("addGrid");
/**
 * 
 * Copy pre-existing grid into grid list
 * @param {Cell[][]} cells
 * Grid to copy into the grid list (represented by 2D Array of Cells)
 */
export const copyGrid = createAction<CopyGridPayload>("copyGrid");
/**
 * Remove grids from the grid list
 * @param {number} num
 * The number of grids to remove.
 */
export const deleteGrid = createAction<DeleteGridPayload>("deleteGrid");
/**
 * Delete grid at a given index in the grid list.
 * @param {number} idx
 * The index of the grid to remove from the grid list.
 */
export const deleteGridAt = createAction<DeleteGridAtPayload>("deleteGridAt");