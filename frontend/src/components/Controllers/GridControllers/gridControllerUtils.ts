import { Cell } from "../../../utils/types";

export const convertArrayToGrid = (
  grid: number[][], 
  interpretAs: "NUMBER" | "BOOLEAN" | "NORMALIZED"
): Cell[][] => {
  let newData: Cell[][] = [];
  for (let i = 0; i < grid.length; i++) {
    let arr: Cell[] = [];
    for (let j = 0; j < grid[0].length; j++) {
      const cellValue = interpretAs === "BOOLEAN" ?
        (grid[i][j] > 0 ? true : false) : grid[i][j];
      arr.push({
        data: cellValue,
        status: "UNEXPLORED"
      }); 
    }
    newData.push(arr);
  }
  return newData;
}

export const convertArrayToFalse = (
  grid: any[][],
): Cell[][] => {
  let newData: Cell[][] = [];
  for (let i = 0; i < grid.length; i++) {
    let arr: Cell[] = [];
    for (let j = 0; j < grid[0].length; j++) {
      arr.push({
        data: false,
        status: "UNEXPLORED"
      }); 
    }
    newData.push(arr);
  }
  return newData;

}