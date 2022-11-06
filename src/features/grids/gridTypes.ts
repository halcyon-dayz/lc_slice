export type GRID_417_CONTEXT = {
    prevCell: [number, number]
    prevTileNumber: number,
}

export type GRID_GENERIC_CONTEXT = {
    prevCell: [number, number]
}


export type GRID_CONTEXT = GRID_417_CONTEXT | GRID_GENERIC_CONTEXT