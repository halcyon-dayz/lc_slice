import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
//import { changeCell, changeCellSize, changeHeight, changeLabel, changeWidth, clearCells, grid } from "./grid/gridSlice";

import { 
    totalStructsReducer 
} from "./totalStructs/totalStructsSlice";
import {
    arraysReducer
} from "./arrays/arraysSlice"
import {
    gridsReducer
} from "./grids/gridsSlice"
import { 
    problemReducer 
} from "./problemInfo/problemSlice";
import { graphsReducer } from "./graphs/graphsSlice";

export const store = configureStore({
    reducer: {
        arrays: arraysReducer,
        grids: gridsReducer,
        graphs: graphsReducer,
        totalStructs: totalStructsReducer,
        problem: problemReducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'grids/changeGridCellsStatusBasedOnData', 
            'grids/changeGridCellSize',
            'problem/pushJSXToLog/'
          ],
          ignoredActionPaths: [
            'payload.element.$$typeof',
            'problem.problemLog.0.$$typeof',
            'payload.element.type',
            'payload.element.props.dispatch',
            'problem.problemLog.0.type',
            'payload.element.props.children.0.$$typeof',
            'payload.element'
          ],
          ignoredPaths: [
            'payload.element.$$typeof',
            'problem.problemLog.0.$$typeof',
            'problem.problemLog.0.type',
            'problem.problemLog.0.props.dispatch',
            'problem.problemLog'
          ]
        }
      })
    }
})

//Types the specific dispatch we expect from our store
export type AppDispatch = typeof store.dispatch;
//export type AppGetState = typeof store.getState