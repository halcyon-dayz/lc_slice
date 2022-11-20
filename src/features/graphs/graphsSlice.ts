import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, GraphDS} from "../../utils/types";
import { addGraph, AddGraphPL, deleteAllStructs, deleteGraph, DeleteGraphPL } from "../sharedActions";
import * as GraphPLs from "./graphPayloads"


const initialState: RootState["graphs"] = [];

const graphsSlice = createSlice({
    name: "graphs",
    initialState,
    reducers: {
        changeNodeRadius: (
            state: RootState["graphs"],
            action: PayloadAction<GraphPLs.ChangeNodeRadiusPL>
        ) => {
            const {graphIndex, newRadius} = action.payload;
            if (graphIndex < 0 || graphIndex >= state.length) {
                return;
            }
            state[graphIndex].nodeRadius = newRadius;
        },

        switchConnected: (
            state: RootState["graphs"],
            action: PayloadAction<GraphPLs.GraphIndexPL>
        ) => {
            const {graphIndex} = action.payload;
            if (graphIndex < 0 || graphIndex >= state.length) {
                return;
            }
            state[graphIndex].connected = !state[graphIndex].connected
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addGraph, (
            state: RootState["graphs"],
            action: PayloadAction<AddGraphPL>
        ) => {
            const numAdd = action.payload.num ? action.payload.num : 1;
            for (let i = 0; i < numAdd; i++) {
                state.push({
                    nodeRadius: 20,
                    connected: true,
                    directed: false,
                    weighted: false,
                    edgeLabels: ["test", "testTwo"]
                })
            }
        }).addCase(deleteGraph, (
            state: RootState["graphs"],
            action: PayloadAction<DeleteGraphPL>
        ) => {
            const numDelete = action.payload.num ? action.payload.num : 1;
            if (numDelete < 0) {
                return;
            }
            if (numDelete >= state.length) {
                return [];
            }
            for (let i = 0; i < numDelete; i++) {
                state.pop();
            }
        }).addCase(deleteAllStructs, (
            state: RootState["graphs"]
        ) => {
            return [];
        })
    }
})

export const graphsRedcuer = graphsSlice.reducer;
export const {
    changeNodeRadius,
    switchConnected
} = graphsSlice.actions