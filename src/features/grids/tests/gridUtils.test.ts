import {
    ARRAY_2D_GET_NEXT_INDEX, 
    ARRAY_2D_IS_VALID_INDEX,
    ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL,
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    ARRAY_2D_GET_EIGHT_DIRECTIONS_FROM_CELL,
    isValidIndex,
    isStateValid,
    northDir,
    southDir,
    eastDir,
    westDir
} from "../gridUtils"


const defaultArray = [
    [0,  1,  2,  3,  4,  5 ],
    [6,  7,  8,  9,  10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],
];

const smol = [[1]];

describe('gridUtils tests', () => {
    test("if generic IsValidIndex works", () => {
        //state length then index
        expect(isValidIndex(4, 3)).toEqual(true);
    })
    test("if out of bounds IsValidIndex works", () => {
        //state length then index
        expect(isValidIndex(4, 5)).toEqual(false);
    })
    test("if negative index passed into IsValidIndex returns false", () => {
        //state length then index
        expect(isValidIndex(4, -1)).toEqual(false);
    })
    test("if IsValidIndex with state length of 0 returns false", () => {
        //state length then index
        expect(isValidIndex(0, 0)).toEqual(false);
        expect(isValidIndex(0, 3)).toEqual(false);
    })

    test("if IsStateValid works", () => {
        //state length then index
        expect(isStateValid(0)).toEqual(false);
        expect(isStateValid(-1)).toEqual(false);
        expect(isStateValid(3)).toEqual(true);
    })
    test("if IsStateValid works on actual array", () => {
        //state length then index
        let arr = [];
        expect(isStateValid(arr.length)).toEqual(false);
        arr.push(1);
        arr.push(2);
        expect(isStateValid(arr.length)).toEqual(true);
    })
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
    

    //Rember in an [i, j] cell, i increments the rows (up and down) and j increments the columns (left to right)
    //for i, north is subtracting from i and south is adding to i
    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works north", () => {
        //Number output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [2, 5])).toEqual([-2, 0]);
        //String output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [3, 5], true)).toEqual("north");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works northeast", () => {
        //Number output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [2, 8])).toEqual([-2, 3]);
        //String output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [2, 8], true)).toEqual("northeast");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works east", () => {
        //Number output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [4, 10])).toEqual([0, 5]);
        //String output
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [4, 10], true)).toEqual("east");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works southeast", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [5, 6])).toEqual([1, 1]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [5, 6], true)).toEqual("southeast");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works south", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [40, 5])).toEqual([36, 0]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [40, 5], true)).toEqual("south");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works southwest", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [40, 2])).toEqual([36, -3]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [40, 2], true)).toEqual("southwest");
    })

    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works west", () => {
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [4, 2])).toEqual([0, -3]);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([4, 5], [4, 2], true)).toEqual("west");
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


    //Rember in an [i, j] cell, i increments the rows (up and down) and j increments the columns (left to right)
    //for i, north is subtracting from i and south is adding to i
    test("if ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL works cardinally on actual array", () => {
        expect(defaultArray[1][2]).toEqual(8)
        const [north, east, south, west] = ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL([1, 2]);
        //Check if Directions provide expected values
        expect(defaultArray[north[0]][north[1]]).toEqual(2);
        expect(defaultArray[south[0]][south[1]]).toEqual(14);
        expect(defaultArray[west[0]][west[1]]).toEqual(7);
        expect(defaultArray[east[0]][east[1]]).toEqual(9);
        //North
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], north)).toEqual(northDir);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], north, true)).toEqual("north");
        //East
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], east)).toEqual(eastDir);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], east, true)).toEqual("east");
        //South
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], south)).toEqual(southDir);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], south, true)).toEqual("south");
        //West
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], west)).toEqual(westDir);
        expect(ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL([1, 2], west, true)).toEqual("west");
    })
})