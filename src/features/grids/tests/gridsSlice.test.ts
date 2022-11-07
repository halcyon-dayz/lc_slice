import { copyGrid } from "../../sharedActions"
import {store} from "../../store"
import {GRID_417_PACIFIC_ATLANTIC_WATER_FLOW} from "../defaultGrids"




describe('gridsSlice redux state tests', () => {
    test('if initial state is empty', () => {
        const grids = store.getState().grids
        expect(grids).toEqual([]);
    })

    test('if copyGrid works', async () => {
        const result = await store.dispatch(copyGrid({
            cells: GRID_417_PACIFIC_ATLANTIC_WATER_FLOW
        }))
        expect(result.type).toEqual("copyGrid")
        const grids = store.getState().grids
        //eslint-disable-next-line
        expect(grids[0]).not.toBeUndefined();
        for (let i = 0; i < grids[0].cells.length; i++) {
            for (let j = 0; j < grids[0].cells[0].length; j++) {
                expect(grids[0].cells[i][j].data).toEqual(
                    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW[i][j].data
                )
                expect(grids[0].cells[i][j].status).toEqual(
                    GRID_417_PACIFIC_ATLANTIC_WATER_FLOW[i][j].status
                )
            }
        }
    })
})