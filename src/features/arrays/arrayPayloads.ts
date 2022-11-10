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
