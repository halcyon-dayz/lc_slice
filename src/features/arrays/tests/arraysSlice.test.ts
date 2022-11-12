import { deleteArray, addArray, copyArray} from "../../sharedActions"
import { popData, pushData } from "../arraysSlice";
import {store} from "../../store"

beforeEach(async () => {
    let arrays = store.getState().arrays;
    let length = arrays.length;
    let result = await store.dispatch(deleteArray({num: length, arraysLength: length}));
    arrays = store.getState().arrays;
    expect(arrays.length).toEqual(0);
})

describe('arraysSlice redux state tests', () => {
    test("if addArray functions", async () => {
        let result = await store.dispatch(addArray({num: 3}));
        expect(result.type).toEqual("addArray");
        let arrays = store.getState().arrays;
        expect(arrays.length).toEqual(3);
        //Each array should start out with only one value
        for (let i = 0; i < 3; i++) {
            expect(arrays[i].width).toEqual(1);
            expect(arrays[i].data.length).toEqual(1);
            expect(arrays[i].data[0].data).toEqual(0);
            expect(arrays[i].data[0].status).toEqual("UNEXPLORED");
        }
    })
    test("if deleteArray functions", async () => {
        let result = await store.dispatch(addArray({num: 5}));
        let arrays = store.getState().arrays;
        expect(arrays.length).toEqual(5);
        result = await store.dispatch(deleteArray({num: 2, arraysLength: arrays.length}));
        expect(result.type).toEqual("deleteArray");
        arrays = store.getState().arrays;
        expect(arrays.length).toEqual(3);
        expect(arrays[4]).toBeUndefined();
        expect(arrays[5]).toBeUndefined();
    })

    test("if adding then deleting all arrays works", async () => {
        await store.dispatch(addArray({num: 5}));
        await store.dispatch(deleteArray({num: 5, arraysLength: 5}))
        let arrays = store.getState().arrays;
        expect(arrays.length).toEqual(0);
        expect(arrays).toEqual([]);
    })

    test("if copyArray works", async () => {
        let result = await store.dispatch(copyArray({data: [1, 2, 3, 4, 5]}))
        expect(result.type).toEqual("copyArray");
        result = await store.dispatch(copyArray({data: [2]}));
        let arrays = store.getState().arrays;
        expect(arrays.length).toEqual(2);
        expect(arrays[0].width).toEqual(5);
        expect(arrays[0].data).toEqual([
            {data: 1, status: "UNEXPLORED"},
            {data: 2, status: "UNEXPLORED"},
            {data: 3, status: "UNEXPLORED"},
            {data: 4, status: "UNEXPLORED"},
            {data: 5, status: "UNEXPLORED"}
        ]);
        expect(arrays[1].width).toEqual(1);
        expect(arrays[1].data).toEqual([
            {data: 2, status: "UNEXPLORED"}
        ]);
    })

    test("if pushData works", async () => {
        //Copy initial arrays
        await store.dispatch(copyArray({data: [1, 2, 3, 4, 5]}))
        await store.dispatch(copyArray({data: [2]}));
        //Push new data to both arrays
        let result = await store.dispatch(pushData({
            arrayIndex: 0, 
            data: [6, 7, 8]
        }));
        expect(result.type).toEqual("arrays/pushData");
        result = await store.dispatch(pushData({
            arrayIndex: 1,
            data: [3]
        }));
        let arrays = store.getState().arrays;
        expect(arrays[0].width).toEqual(8);
        expect(arrays[0].data[5]).toEqual({data: 6, status: "UNEXPLORED"});
        expect(arrays[0].data[6]).toEqual({data: 7, status: "UNEXPLORED"});
        expect(arrays[0].data[7]).toEqual({data: 8, status: "UNEXPLORED"});
        expect(arrays[1].width).toEqual(2);
        expect(arrays[1].data[0]).toEqual({data: 2, status: "UNEXPLORED"});
        expect(arrays[1].data[1]).toEqual({data: 3, status: "UNEXPLORED"});
    })

    test("if popData works", async () => {
        await store.dispatch(copyArray({data: [1, 2, 3, 4, 5]}))
        let result = await store.dispatch(popData({
            arrayIndex: 0, 
            num: 3
        }));
        expect(result.type).toEqual("arrays/popData");
        let arrays = store.getState().arrays
        expect(arrays[0].width).toEqual(2);
        expect(arrays[0].data).toEqual([
            {data: 1, status: "UNEXPLORED"},
            {data: 2, status: "UNEXPLORED"}
        ])
    })
})