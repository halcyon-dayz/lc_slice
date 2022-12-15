import { Cell } from "../../../utils/types";
import { ARRAY_2D_GET_NEXT_INDEX } from "../../../features/grids/gridUtils";
import { pushJSXToLog } from "../../../features/problemInfo/problemSlice";
import { changeGridCellStatus } from "../../../features/grids/gridsSlice";
import { CellHighlighter } from "../CellHighlighter";
import { GridInterpreter } from "../../../__generated__/resolvers-types";
import { copyGrids } from "../../../features/grids/gridsSlice";
import { GridCreationLog } from "./logUtils";


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

export const iterateToNextCell = (
  dispatch: any, 
  grid: Cell[][],
  currentCell: [number, number]
): [number, number] => {
  const nextCell = ARRAY_2D_GET_NEXT_INDEX(grid, currentCell[0], currentCell[1]);
  dispatch(changeGridCellStatus({
    gridIndex: 0,
    row: nextCell[0],
    col: nextCell[1],
    status: "CURRENT"
  }));
  return nextCell;
}

export const parseCurrentCellFromString = (cellString: string): [number, number] => {
  return [
    parseInt(cellString[1]),
    parseInt(cellString[4])
  ]
}

export const createStringFromCurrentCell = (cell: [number, number]): string => {
  return `[${cell[0]}, ${cell[1]}]`;
}


export const handleServerGrid = (
  dispatch: any, 
  gridData: number[][],
  label?: string,
  interpretAs?: GridInterpreter,
) => {
  const convertedGrid = convertArrayToGrid(gridData as number[][], interpretAs ? interpretAs : "NUMBER");
  dispatch(copyGrids([convertedGrid]));
  const element: JSX.Element = (
    <GridCreationLog 
      dispatch={dispatch}
      numStructs={1}
      labels={[label ? label : "Grid #1"]}
    />
  );
  dispatch(pushJSXToLog({element: element}));
}