
import { CreateSliceOptions, SliceCaseReducers} from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
export const createSliceExtra = <
    State, 
    CaseReducers extends SliceCaseReducers<State>, 
    Name extends string = string
>(
    options: CreateSliceOptions<State, CaseReducers, Name>,
) => {
    const slice = createSlice(options);
    return slice;
}