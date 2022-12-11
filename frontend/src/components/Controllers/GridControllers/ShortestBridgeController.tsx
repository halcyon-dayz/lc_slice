import { useQuery, useLazyQuery, TypedDocumentNode, gql} from "@apollo/client"
import React, { useEffect, useState } from "react"
import { changeGridCellStatus, copyGrids, changeGridCellsStatusBasedOnData} from "../../../features/grids/gridsSlice"
import { ARRAY_2D_GET_NEXT_INDEX } from "../../../features/grids/gridUtils"
import { useAppDispatch, useAppSelector } from "../../../features/hooks"
import { clearLog, pushJSXToLog } from "../../../features/problemInfo/problemSlice"
import { addGrid, deleteAllStructs } from "../../../features/sharedActions"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum"
import { CellStatus } from "../../../utils/types"
import { useGetGridFromProblemExampleLazyQuery, useGetProblemNumExamplesQuery } from "../../../__generated__/resolvers-types"
import { BasicController } from "../BasicController"
import {ControllerProps} from "../controllerProps"
import { convertArrayToGrid } from "./gridControllerUtils"
import { GridCreationLog } from "./logUtils"



const LengthEdgeCaseLog = (
  dispatch: any
): JSX.Element => {
  return (
    <div>
      Due to the grid's size, the shortest possible bridge must be of length 1.
    </div>
  )
}

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
  const logLength = useAppSelector(state => state.problem.problemLog.length);
  const problemNumber = useAppSelector(state => state.problem.problemNumber);
  /* Local state variables */
  const [example, setExample] = useState<number>(0);
  /* Client state variables */
  const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery();
  //Create current context, array of cells
  const [currentContext, setCurrentContext] = useState<NumberCell[]>([[0, 0]]);
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);

  /* Setup Function */
  const clickSetUp = async () => {
    console.log(`setup Example: ${example}`)
    dispatch(deleteAllStructs());
    dispatch(clearLog());
    await getGrid({
      variables: {
        number: QUESTIONS_ENUM.SHORTEST_BRIDGE,
        example: example
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
    //Check for Edge Cases
    if (grid.length === 2) {
      if (logLength !== 2) {
        dispatch(pushJSXToLog({element: LengthEdgeCaseLog(dispatch)}));
      }
      return;
    }

    const i = currentCell[0]
    const j = currentCell[1];
    const curTileValue = grid[i][j].data


    if (curTileValue === 1) {
      
    }

    if (curTileValue === 0) {
      const [nextI, nextJ] = ARRAY_2D_GET_NEXT_INDEX(grid, i, j);
      dispatch(changeGridCellStatus({
          gridIndex: 0,
          row: i,
          col: j,
          status: "UNEXPLORED"
      }));
      dispatch(changeGridCellStatus({
        gridIndex: 0,
        row: nextI,
        col: nextJ,
        status: "CURRENT"
      }))
      setCurrentCell([nextI, nextJ])
    }
    setCurrentContext([...currentContext])
  }

  //If playing and the current context changes, click step again.
  useEffect(() => {
    if (animationOn && problemNumber === QUESTIONS_ENUM.SHORTEST_BRIDGE) {
      setTimeout(() => clickStep(), animationSpeed);
    }
  }, [animationOn]); //curentContext to array


  return (
    <div>
    <BasicController
      label={"Label For Shortest Bridge Problem"}
      play={() => console.log("Play")}
      setup={clickSetUp}
      pause={() => console.log("Pause")}
      step={clickStep}
    />
      <div>{example}</div>
    </div>
  )
}