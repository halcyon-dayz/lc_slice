import { useQuery, useLazyQuery, TypedDocumentNode, gql} from "@apollo/client"
import React, { useEffect, useState } from "react"
import { changeGridCellStatus, copyGrids, changeGridCellsStatusBasedOnData} from "../../../features/grids/gridsSlice"
import { useAppDispatch, useAppSelector } from "../../../features/hooks"
import { addGrid, deleteAllStructs } from "../../../features/sharedActions"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum"
import { CellStatus } from "../../../utils/types"
import { useGetGridFromProblemExampleLazyQuery, useGetProblemNumExamplesQuery } from "../../../__generated__/resolvers-types"
import { BasicController } from "../BasicController"
import {ControllerProps} from "../controllerProps"
import { convertArrayToGrid } from "./gridControllerUtils"

export const ShortestBridgeController = ({
  animationOn,
  play,
  pause,
  animationSpeed
}: ControllerProps) => {
  /* Redux State variables */
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
  /* Local state variables */
  const [example, setExample] = useState<number>(0);
  /* Client state variables */
  const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery();

  /* Setup Function */
  const clickSetUp = async () => {
    console.log(`setup Example: ${example}`)
    dispatch(deleteAllStructs());
    await getGrid({
      variables: {
        number: QUESTIONS_ENUM.SHORTEST_BRIDGE,
        example: example
      }
    });
  }

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
      dispatch(changeGridCellsStatusBasedOnData({gridIndex: 0, dataToStatus: dataToStatus}))
    }
  }, [gridClient]);

  return (
    <div>
    <BasicController
      label={"Label For Shortest Bridge Problem"}
      play={() => console.log("Play")}
      setup={clickSetUp}
      pause={() => console.log("Pause")}
      step={() => console.log("Step")}
    />
      <div>{example}</div>
    </div>
  )
}