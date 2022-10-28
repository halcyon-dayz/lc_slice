import { AnyAction } from "@reduxjs/toolkit";
import { ThunkAction } from "@reduxjs/toolkit";
import { lchown } from "fs";
import { LC_QUESTIONS } from "./questionEnum";


export type CellStatus = "NO_DATA" | "PROCESSING" | "EXPLORED" | "LOCKED" | "UNEXPLORED" | "START" | "END" |
"WATER" | "ISLAND" | "DEEP_OCEAN"

export type DataStructureType = "GRID" | "ARRAY"

export type Cell = {
    data: number
    status: CellStatus
}

interface TreeNode<TValue = unknown, TKey = unknown> {
    left?: TreeNode<TValue>
    right?: TreeNode<TValue>
    value: TValue
    key?: TKey
}


export type GridDS = {
    type: "GRID",
    indexInList: number,
    label: string,
    cells: Cell[][],
    width: number,
    height: number,
    cellStyleWidth: number,
    cellStyleHeight: number,
    startNodeRow?: number,
    startNodeCol?: number,
    endNodeRow?: number,
    endNodeCol?: number
}


export type ArrDS = {
    type: "ARRAY"
    label: string,
    data: Cell[]
    width: number
}


export type DataStructures = {
    grids: GridDS[],
    arrays: ArrDS[],
    totalStructs: number
}

export type RootState = {
    questionNumber: number
    questionText: string
    grids: GridDS[],
    arrays: ArrDS[],
    totalStructs: number
}

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

//If you want to return a promise after dispatching the thunk write
//AppThunk<Promise<SomeReturnType>>
