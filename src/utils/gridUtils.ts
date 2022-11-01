export const ARRAY_2D_INDEX_IS_VALID = <T,>(arr: T[][], row: number, col: number): boolean => {
    if (row < 0 || col < 0 || row >= arr.length || col >= arr[0].length) {
        return false
    }
    return true;
}

export const ARRAY_2D_GET_NEXT_INDEX = <T,>(arr: T[][], row: number, col: number): [number, number] => {
    if (ARRAY_2D_INDEX_IS_VALID(arr, row, col) === false) {
        return [-1, -1];
    }
    if (row === arr.length - 1 && col === arr[0].length - 1) {
        return [0, 0];
    }
    if (col === arr[0].length - 1 && ARRAY_2D_INDEX_IS_VALID(arr, row + 1, 0)) {
        return [row + 1, 0];
    }
    return [row, col + 1];
}