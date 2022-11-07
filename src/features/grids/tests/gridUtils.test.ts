import {
    ARRAY_2D_GET_NEXT_INDEX, 
    ARRAY_2D_IS_VALID_INDEX
} from "../gridUtils"


const defaultArray = [
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
];

const smol = [[1]];

describe('gridUtils tests', () => {
    test("if all existing cells are valid", () => {
        for (let i = 0; i < defaultArray.length; i++) {
            for (let j = 0; j < defaultArray[0].length; j++) {
                expect(ARRAY_2D_IS_VALID_INDEX(defaultArray, i, j)).toBeTruthy();
            }
        }
    })

    test("if returns false on invalid row", () => {
        expect(ARRAY_2D_IS_VALID_INDEX(defaultArray, defaultArray.length, 0)).toBeFalsy();
        expect(ARRAY_2D_IS_VALID_INDEX(defaultArray, defaultArray.length + 1, 0)).toBeFalsy();
    })

    test("if returns false on invalid column", () => {
        expect(ARRAY_2D_IS_VALID_INDEX(defaultArray, 0, defaultArray[0].length)).toBeFalsy();
        expect(ARRAY_2D_IS_VALID_INDEX(defaultArray, 0, defaultArray[0].length + 1)).toBeFalsy();
    })

    test("if ARR_2D_GET_NEXT_INDEX returns [-1, -1] for invalid cells", () => {
        expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, defaultArray.length, defaultArray[0].length)).toEqual([-1, -1]);
        expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, 0, defaultArray[0].length)).toEqual([-1, -1]);
        expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, defaultArray.length, 0)).toEqual([-1, -1]);
        expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, -1, -1)).toEqual([-1, -1]);
    })

    test("if each cell has a proper next cell", () => {
        const numRows = defaultArray.length;
        const numCols = defaultArray[0].length;
        for (let i = 0; i < defaultArray.length; i++) {
            for (let j = 0; j < defaultArray[0].length; j++) {
                if (i === numRows - 1 && j === numCols - 1) {
                    //eslint-disable-next-line
                    expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, i, j)).toEqual([0, 0]);
                    continue;
                }
                if (j === numCols - 1) {
                    //eslint-disable-next-line
                    expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, i, j)).toEqual([i + 1, 0]);
                    continue;
                } else {
                    //eslint-disable-next-line
                    expect(ARRAY_2D_GET_NEXT_INDEX(defaultArray, i, j)).toEqual([i, j + 1]);
                    continue;
                }    
            }
        }
    })
    test("if next cell of single cell grid will be itself", () => {
        const i = smol.length;
        const j = smol[0].length
        expect(ARRAY_2D_GET_NEXT_INDEX(smol, 0, 0)).toEqual([0, 0]);
    })
})