import {
    ARRAY_2D_GET_NEXT_INDEX, 
    ARRAY_2D_IS_VALID_INDEX,
    ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL,
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    ARRAY_2D_GET_EIGHT_DIRECTIONS_FROM_CELL,
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
    
    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works southeast", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [5, 6])).toEqual([1, 1]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [5, 6], true)).toEqual("southeast");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works northwest", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [0, 4])).toEqual([-4, -1]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [3, 4], true)).toEqual("northwest");
    })

    test("if ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL works", () => {
        expect(ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL([5, 10])).toEqual([
            //north
            [4, 10],
            //east
            [5, 11],
            //south
            [6, 10],
            //west
            [5, 9]
        ])
    })
    test("if ARRAY_2D_GET_EIGHT_DIRECTIONS_FROM_CELL works", () => {
        expect(ARRAY_2D_GET_EIGHT_DIRECTIONS_FROM_CELL([5, 10])).toEqual([
            //north
            [4, 10],
            //northeast
            [4, 11],
            //east
            [5, 11],
            //southeast
            [6, 11],
            //south
            [6, 10],
            //southwest
            [6, 9],
            //west
            [5, 9],
            //northwest
            [4, 9]
        ]);
    })
})