import { AnyAction } from "@reduxjs/toolkit";
import { ThunkAction } from "@reduxjs/toolkit";
import { lchown } from "fs";
import { Root } from "react-dom/client";
import { LC_QUESTIONS } from "./questionEnum";


export type CellStatus = "NO_DATA" | "PROCESSING" | "EXPLORED" | "LOCKED" | "UNEXPLORED" | "START" | "END" |
"WATER" | "ISLAND" | "DEEP_OCEAN" | "MONKEY_ISLAND" | "CURRENT" | "PREV_EVALUATE"

export type DataStructureType = "GRID" | "ARRAY"

export type Cell = {
    data: any
    status: CellStatus
}

interface TreeNode<TValue = unknown, TKey = unknown> {
    left?: TreeNode<TValue>
    right?: TreeNode<TValue>
    value: TValue
    key?: TKey
}

export type GridDS = {
    type: string,
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
    type: string,
    label?: string,
    data: Cell[]
    width: number,
    pointerLocations?: number[],
}

export type RootState = {
    questionNumber: number
    questionText: string
    grids: GridDS[],
    arrays: ArrDS[],
    totalStructs: number
}


export type RootStateKeys = keyof RootState


export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

//If you want to return a promise after dispatching the thunk write
//AppThunk<Promise<SomeReturnType>>
