import { CellStatus } from "../../utils/types"


/** 
 * @typedef {object} ChangeGridWidthPayload
 * @property {number} newWidth New width of the grid, prompting addition or deletion of new columns.
 * @property {number} gridIndex Index of grid in grid list to operate on.
 * @property {number} [defaultValue] Value to fill new cells with.
 */
export type ChangeGridWidthPayload = {
    newWidth: number,
    gridIndex: number,
    defaultValue?: number
}

export type ChangeGridHeightPayload = {
    newHeight: number,
    gridIndex: number,
    defaultValue?: number
}

export type ChangeGridCellPayload = {
    gridIndex: number,
    row: number,
    col: number,
    data: number,
    status: CellStatus
}

export type ChangeGridCellStatusPayload = Omit<ChangeGridCellPayload, "data">

export type ChangeGridCellSizePayload = {
    gridIndex: number,
    width: number,
    height: number
}

export type ClearGridCellsPayload = {
    gridIndex: number
    defaultValue?: number
    defaultStatus?: CellStatus
}

export type ChangeGridLabelPayload = {
    gridIndex: number,
    label: string
}
