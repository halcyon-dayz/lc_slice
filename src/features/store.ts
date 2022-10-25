import { configureStore } from "@reduxjs/toolkit";
//import { changeCell, changeCellSize, changeHeight, changeLabel, changeWidth, clearCells, grid } from "./grid/gridSlice";

import { totalStructsReducer } from "./totalStructs/totalStructsSlice";

//Custom Middleware uses the Middleware type and passes generic arguments 
//for dispatch and state
/* export const exampleMiddleware: Middleware<
    {},
    RootState
> = storeApi => next => action => {
    const state = storeApi.getState()
} */


export const store = configureStore({
    reducer: {
        totalStructsReducer
    },
    devTools: true, 
})



//Types the specific dispatch we expect from our store
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState