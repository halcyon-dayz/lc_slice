import { addGrid, deleteArray, deleteGrid } from "../../sharedActions";
import {store} from "../../store"
import { deleteAllStructs } from "../totalStructsSlice";

beforeEach(async () => {
    let arrays = store.getState().arrays;
    let grids = store.getState().grids;
    let resultOne = await store.dispatch(deleteGrid({num: grids.length}));
})

describe("totalStructsSlice redux state tests", () => {

    test("if addGrid increments totalStructs", async () => {
        let totalStructs = store.getState().totalStructs;
        expect(totalStructs).toEqual(0);
        let result = await store.dispatch(addGrid({num: 2}));
        totalStructs = store.getState().totalStructs;
        expect(totalStructs).toEqual(2);
    })

    test("if deleteGrid decrements totalStructs", async () => {
        let result = await store.dispatch(addGrid({num: 10}));
        let totalStructs = store.getState().totalStructs;
        expect(totalStructs).toEqual(10);
        result = await store.dispatch(deleteGrid({num: 3}));
        totalStructs = store.getState().totalStructs;
        expect(totalStructs).toEqual(7);
        



    })
 
})