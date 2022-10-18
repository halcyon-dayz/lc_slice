import { AnyAction } from "@reduxjs/toolkit";
import { ThunkAction } from "@reduxjs/toolkit";


export type CellStatus = "NO_DATA" | "PROCESSING" | "EXPLORED" | "LOCKED" | "UNEXPLORED" | "START" | "END"

export type Cell = {
    data: any
    status: CellStatus
}


export type GridStructureDisplay = {
    type: "GRID";
    label: string
    cells: Cell[][]
    width: number
    height: number,
    cellStyleWidth: number,
    cellStyleHeight: number,
    startNodeRow?: number,
    startNodeCol?: number,
    endNodeRow?: number,
    endNodeCol?: number
}

export type RootState = {
    questionNumber: number
    questionText: string
    grid: GridStructureDisplay
}

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

//If you want to return a promise after dispatching the thunk write
//AppThunk<Promise<SomeReturnType>>
