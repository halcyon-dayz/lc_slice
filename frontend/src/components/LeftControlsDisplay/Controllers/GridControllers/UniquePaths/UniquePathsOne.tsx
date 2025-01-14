import React, {useState, useEffect} from "react"
import { ControllerProps } from "../../controllerUtils";
import { useAppDispatch, useAppSelector } from "../../../../../features/hooks";
import { clearState } from "../../../../../utils/clearState";
import { QUESTIONS_ENUM } from "../../../../../utils/questionEnum";
import { GridInterpreter, useGetGridFromProblemExampleLazyQuery } from "../../../../../__generated__/resolvers-types";
import { handleServerGrid } from "../gridControllerUtils";
import { changeGridCell, changeGridCellData, changeGridCellStatus } from "../../../../../features/grids/gridsSlice";
import { BasicController } from "../../BasicController";
import { ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL, ARRAY_2D_GET_NEXT_INDEX, ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL } from "../../../../../features/grids/gridUtils";
import { GridCreationLog } from "../logUtils";
import { pushJSXToLog } from "../../../../../features/problemInfo/problemSlice";
import { CellHighlighter } from "../../CellHighlighter";
import { UniquePathsInitialCellSetup } from "./uniquePathsHelpers";

export const UniquePathsOne = ({animationOn, play, pause, animationSpeed}: ControllerProps) => {
  /* Global State Variables */
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
  const problemNumber = useAppSelector(state => state.problem.problemNumber);
  /* Local State Variables */
  const [example, setExample] = useState<number>(0);
  /* Client State Variables */
  const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery();
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);
  const [complete, setComplete] = useState<boolean>(false);


  const clickSetUp = async () => {
    clearState(dispatch, QUESTIONS_ENUM.UNIQUE_PATHS);
    await getGrid({
      variables: {
        number: QUESTIONS_ENUM.UNIQUE_PATHS,
        example: example,
      }
    })
  }

  useEffect(() => {
    if (gridClient.data && gridClient.data.problem && gridClient.data.problem.grids && gridClient.data.problem.grids[0]) {
      const {interpretAs, gridData, label} = gridClient.data.problem.grids[0];
      handleServerGrid(dispatch, gridData as number[][], label as string, interpretAs as GridInterpreter);
      setExample((example + 1) % gridClient.data.problem.numExamples);
      dispatch(changeGridCellStatus({gridIndex: 0, row: 0, col: 0, status: "CURRENT"}));
      setCurrentCell([0, 0]);
      setComplete(false);
    }
  }, [gridClient]);


  const clickStep = () => {
    if (complete) {
      return;
    }
    dispatch(changeGridCellStatus({
      gridIndex: 0,
      row: currentCell[0], 
      col: currentCell[1],
      status: "UNEXPLORED",
    }));
    //Store current row and column values
    const row = currentCell[0];
    const col = currentCell[1];
    //Default value for first cell;
    if (row === 0 && col === 0) {
      const nextCell = UniquePathsInitialCellSetup(dispatch, currentCell, grid);
      setCurrentCell(nextCell);
      return;
    }
    let sum = 0;
    let prevCells = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL(currentCell, "BEHIND", grid);
    for (let i = 0; i < prevCells.length; i++) {
        //Look at behind cells and clear status
        let prevCellRow = prevCells[i][0];
        let prevCellCol = prevCells[i][1];
        sum += grid[prevCellRow][prevCellCol].data;
        dispatch(changeGridCellStatus({
          gridIndex: 0,
          row: prevCellRow,
          col: prevCellCol,
          status: "UNEXPLORED"
        }))
    }
    dispatch(changeGridCellData({
      gridIndex: 0,
      row: currentCell[0],
      col: currentCell[1],
      data: sum,
    }))
    //set current cell to next cell in the grid
    const [nextRow, nextCol] = ARRAY_2D_GET_NEXT_INDEX(grid, row, col);
    dispatch(changeGridCell({
        gridIndex: 0,
        row: nextRow, 
        col: nextCol,
        data: 0,
        status: "CURRENT",
    }));
    let element: JSX.Element = (
      <p>
        {`Added values above and to the left of cell`}
        <CellHighlighter dispatch={dispatch} cell={currentCell}/>
      </p>
    )
    dispatch(pushJSXToLog({element: element}));
    element = (
      <p>
        {`Iterated to cell`}
        <CellHighlighter dispatch={dispatch} cell={[nextRow, nextCol]} />
      </p>
    )
    dispatch(pushJSXToLog({element: element}));
    if (nextRow === 0 && nextCol === 0) {
      setComplete(true);
      pause();
      const element: JSX.Element = (
        <p>{`Last element reached. Final number of paths is `}<b>{`${sum}`}</b></p>
      )
      dispatch(pushJSXToLog({element: element}));
      return;
    }

    const prevOfNextCells = ARRAY_2D_GET_TWO_DIRECTIONS_FROM_CELL([nextRow, nextCol], "BEHIND", grid);
    for (let i = 0; i < prevOfNextCells.length; i++) {
      dispatch(changeGridCellStatus({
        gridIndex: 0,
        row: prevOfNextCells[i][0],
        col: prevOfNextCells[i][1],
        status: "PREV_EVALUATE"
      }))
    }
    setCurrentCell([nextRow, nextCol]);
  }

  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.UNIQUE_PATHS) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [currentCell, animationOn]);




  return (
    <div>
    <BasicController
      label={"Unique Paths I"}
      setup={clickSetUp}
      step={clickStep}
      pause={pause}
      play={() => {
          if (problemNumber !== QUESTIONS_ENUM.UNIQUE_PATHS) {
              clickSetUp();
          }
          play();
      }}
    />
    </div>
  )
}