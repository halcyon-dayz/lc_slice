import { Cell, CellStatus } from "../../utils/types"

interface GridIndexPL {
    gridIndex: number,
}

interface RowColPL {
    row: number,
    col: number,
}


export type ChangeGridWidthPayload = {
    newWidth: number,
    gridIndex: number,
    defaultValue?: number,
    defaultStatus?: CellStatus
}

export type ChangeGridHeightPayload = {
    newHeight: number,
    gridIndex: number,
    defaultValue?: number,
    defaultStatus?: CellStatus
}

export type ChangeGridCellPayload = {
    gridIndex: number,
    row: number,
    col: number,
    data: any,
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
    defaultValue?: any
    defaultStatus?: CellStatus
}

export type ClearGridCellsStatusPayload = {
    gridIndex: number, 
    defaultStatus: CellStatus
}

export type ChangeGridLabelPayload = {
    gridIndex: number,
    label: string
}

export type ClearGridRowPayload = {
    gridIndex: number,
    row: number, 
    data: number, 
    status: CellStatus
}

export type ChangeGridCellDataPayload = Omit<ChangeGridCellPayload, "status">

export interface ChangeGridIndividualCellSize extends GridIndexPL, RowColPL {
    width: number | undefined, 
    height: number | undefined,
}