export type PushDataPayload = {
    arrayIndex: number,
    data: any[],
}

export type PopDataPayload = {
    arrayIndex: number,
    num: number,
}

export type PushDataAtIndexPayload = {
    arrayIndex: number, 
    index: number,
    data: any[]
    replaceAtIndex: boolean
}

export type RemoveIndexAtPayload = {
    arrayIndex: number, 
    index: number,
}

export type AddPointerPayload = {
    arrayIndex: number,
    location?: number
}

export type DeletePointerPayload = {
    arrayIndex: number,
    pointerIndex?: number
}

export type MovePointerPayload = {
    arrayIndex: number,
    pointerIndex: number, 
    newLocation: number
}