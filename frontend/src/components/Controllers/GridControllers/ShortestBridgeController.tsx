// #region Imports
import React, { useEffect, useState } from "react"
import { pushData, shift } from "../../../features/arrays/arraysSlice"
import { changeGridCellStatus, clearGridCellsStatus, copyGrids, floodFillFromInputWithQueue} from "../../../features/grids/gridsSlice"
import { ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL } from "../../../features/grids/gridUtils"
import { useAppDispatch, useAppSelector } from "../../../features/hooks"
import { clearLog, pushJSXToLog } from "../../../features/problemInfo/problemSlice"
import { addArray, deleteAllStructs, deleteArray } from "../../../features/sharedActions"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum"
import { CellStatus } from "../../../utils/types"
import { useGetGridFromProblemExampleLazyQuery } from "../../../__generated__/resolvers-types"
import { BasicController } from "../BasicController"
import {ControllerProps} from "../controllerProps"
import { clearState } from "../controllerUtils"
import { convertArrayToGrid, createStringFromCurrentCell, iterateToNextCell, parseCurrentCellFromString } from "./gridControllerUtils"
import { GridCreationLog, LengthEdgeCaseLog} from "./logUtils"

//#endregion





type NumberCell = [number, number];

export const ShortestBridgeController = ({
  animationOn,
  play,
  pause,
  animationSpeed
}: ControllerProps) => {
  /* Redux State variables */
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
  const queue = useAppSelector(state => state.arrays[0] ? state.arrays[0].data: []);
  const logLength = useAppSelector(state => state.problem.problemLog.length);
  const problemNumber = useAppSelector(state => state.problem.problemNumber);
  /* Local state variables */
  const [example, setExample] = useState<number>(0);
  /* Client state variables */
  const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery();
  //Create current context, array of cells
  const [currentContext, setCurrentContext] = useState<NumberCell[]>([[0, 0]]);
  const [currentCell, setCurrentCell] = useState<NumberCell>([0, 0]);
  const [bridgeLength, setBridgeLength] = useState<number>(0);
  const [problemComplete, setProblemComplete] = useState<boolean>(false);

  /* Setup Function */
  const clickSetUp = async () => {
    setProblemComplete(false);
    clearState(dispatch, QUESTIONS_ENUM.SHORTEST_BRIDGE);
    await getGrid({
      variables: {
        number: QUESTIONS_ENUM.SHORTEST_BRIDGE,
        example: 0,
      }
    });
  }

  /* Asynchronously complete set up once data has been fetched */
  useEffect(() => {
    //TODO: This is a bad way to deal with undefined
    if (gridClient.data && gridClient.data.problem && gridClient.data.problem.grids && gridClient.data.problem.grids[0]) {
      const {interpretAs, gridData} = gridClient.data.problem.grids[0];
      //TODO: This is also bad
      const grid = convertArrayToGrid(gridData as number[][], interpretAs);
      dispatch(copyGrids([grid]));
      setExample((example + 1) % gridClient.data.problem.numExamples);
      let dataToStatus = new Map<any, CellStatus>();
      dataToStatus.set(1, "BRIDGE");
      dataToStatus.set(0, "WATER");
      dispatch(changeGridCellStatus({gridIndex: 0, row: 0, col: 0, status: "CURRENT"}));
      const element = (
        <GridCreationLog
          dispatch={dispatch}
          numStructs={1}
          labels={["Grid #1"]}
        />
      );
      dispatch(pushJSXToLog({element: element}));
    }
  }, [gridClient]);

  //TODO: Network error checking

  const clickStep = () => {
    if (problemComplete) {
      return;
    }
    //Check for Edge Cases
    if (grid.length === 2) {
      if (logLength !== 2) {
        dispatch(pushJSXToLog({element: LengthEdgeCaseLog(dispatch)}));
      }
      return;
    }

    if (queue.length !== 0) {
      //Increment bridge length
      setBridgeLength(bridgeLength + 1);
      const cellStringData = queue.map((ele) => ele.data);
      for (let i = 0; i < queue.length; i++) {
        const cell = parseCurrentCellFromString(queue[i].data as string);
        //BFS from current cell, no negatives
        const bfsCells = ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell, grid);
        //Parse cells found in bfs
        for (let i = 0; i < bfsCells.length; i++) {
          const newCellString = createStringFromCurrentCell(bfsCells[i]);
          //If the cell we found already exists in the queue, continue early
          if (cellStringData.find((cellString) => cellString === newCellString) !== undefined) {
            continue;
          }
          const newRow = bfsCells[i][0];
          const newCol = bfsCells[i][1];
          if (grid[newRow][newCol].data === 1) {
            dispatch(clearGridCellsStatus({gridIndex: 0, defaultStatus: "UNEXPLORED"}));
            dispatch(changeGridCellStatus({gridIndex: 0, row: newRow, col: newCol, status: "CURRENT"}));
            dispatch(deleteArray({num: 1, arraysLength: 1}));
            setProblemComplete(true);
            return;
          }
          dispatch(changeGridCellStatus({gridIndex: 0, row: bfsCells[i][0], col: bfsCells[i][1], status: "CURRENT"}));
          dispatch(pushData({arrayIndex: 0, data: [newCellString]}));
          cellStringData.push(newCellString);
        }
      }
      for (let i = 0; i < queue.length; i++) {
        const cell = parseCurrentCellFromString(queue[i].data as string);
        dispatch(changeGridCellStatus({gridIndex: 0, row: cell[0], col: cell[1], status: "UNEXPLORED"}));
        dispatch(shift({arrayIndex: 0}));
      }
      return;
    }

    const i = currentCell[0];
    const j = currentCell[1];
    const curTileValue = grid[i][j].data


    if (curTileValue === 1 && queue.length === 0) {
      dispatch(addArray({num: 1}));
      dispatch(floodFillFromInputWithQueue(
        0,
        currentCell,
        1,
        0,
        "CURRENT"
      ));
      dispatch(shift({arrayIndex: 0}));
      return;
    }

    if (curTileValue === 0) {
        //Clear current cell
      dispatch(changeGridCellStatus({
        gridIndex: 0,
        row: i,
        col: j,
        status: "UNEXPLORED"
      }));
      const [nextI, nextJ] = iterateToNextCell(dispatch, grid, currentCell);
      setCurrentCell([nextI, nextJ])
      return;
    }
  }

  //If playing and the current context changes, click step again.
  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.SHORTEST_BRIDGE) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [animationOn]); //curentContext to array


  return (
    <BasicController
      label={"Label For Shortest Bridge Problem"}
      play={() => {
        if (problemNumber !== QUESTIONS_ENUM.SHORTEST_BRIDGE) {
          clickSetUp();
        }
        play();
      }}
      setup={clickSetUp}
      pause={pause}
      step={clickStep}
    />
  )
}