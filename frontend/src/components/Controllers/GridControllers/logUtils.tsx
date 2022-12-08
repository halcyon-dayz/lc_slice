import React from "react"
import { CellHighlighter } from "../CellHighlighter";


type SearchFromToLogProps = {
    dispatch: any,
    direction: string,
    cell: [number, number],
    nextCell: [number, number],
    tileValue?: number,
    nextTileValue?: number
}

export const SearchFromToLog = ({
    dispatch,
    direction,
    cell,
    nextCell,
    tileValue,
    nextTileValue
}: SearchFromToLogProps): JSX.Element => {
    if (tileValue && nextTileValue) {
        return (
            <p>
                <b>{`Searched `}</b><i>{`${direction}`}</i><b>{` from cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={cell} />
                <b>{` with value `}</b><i>{`${tileValue}`}</i><b>{` to cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={nextCell}/>
                <b>{` with value `}</b><i>{`${nextTileValue}.`}</i>
            </p> 
        );
    } else {
        return (
            <p>
                <b>{`Searched `}</b><i>{`${direction}`}</i><b>{` from cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={cell} />
                <b>{` to cell`}</b>
                <CellHighlighter dispatch={dispatch} cell={nextCell}/>
            </p> 
        );
    }
}