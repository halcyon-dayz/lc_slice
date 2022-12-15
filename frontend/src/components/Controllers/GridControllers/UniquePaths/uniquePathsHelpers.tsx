import { ARRAY_2D_GET_NEXT_INDEX, ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL} from "../../../../features/grids/gridUtils";
import { changeGridCellData, changeGridCellStatus} from "../../../../features/grids/gridsSlice";
import { pushJSXToLog } from "../../../../features/problemInfo/problemSlice";
import { Cell } from "../../../../utils/types";

/**
 * Set up the first cell in a Unique Paths Problem and return the nextcell
 * @param {number} dispatch 
 *  A redux dispatch function.
 * @param {[number, number]} currentCell
 * The problem's currently evaluated cell
 * @param {Cell[][]} grid
 * The problem's current grid
 * @returns {[number, number]}
 * The next cell after the current cell
 */
export const UniquePathsInitialCellSetup = (
  dispatch: any, 
  currentCell: [number, number],
  grid: Cell[][],
): [number, number] => {
  const nextCell = ARRAY_2D_GET_NEXT_INDEX(grid, currentCell[0], currentCell[1]);
  dispatch(changeGridCellData({
    gridIndex: 0,
    row: 0,
    col: 0,
    data: 1
  }))
  dispatch(changeGridCellStatus({
    gridIndex: 0,
    row: nextCell[0], 
    col: nextCell[1],
    status: "CURRENT",
  }));
  let prevOfNextCells = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL(nextCell, "BEHIND", grid);
  for (let i = 0; i < prevOfNextCells.length; i++) {
    dispatch(changeGridCellStatus({
      gridIndex: 0,
      row: prevOfNextCells[i][0],
      col: prevOfNextCells[i][1],
      status: "PREV_EVALUATE"
    }))
  }
  const element: JSX.Element = (
    <p>Set starting cell to <b>1.</b></p>
  )
  dispatch(pushJSXToLog({element: element}));
  return nextCell;
}