import {isValidIndex, isStateValid, ARRAY_2D_IS_VALID_INDEX} from "../../gridUtils"

const defaultArray = [
    [0,  1,  2,  3,  4,  5 ],
    [6,  7,  8,  9,  10, 11],
    [12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29],
];


const smol = [[1]];

describe('gridUtilsValidation tests', () => {
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
})