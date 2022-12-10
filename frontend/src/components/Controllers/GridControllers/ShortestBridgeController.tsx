import { useQuery, useLazyQuery, TypedDocumentNode, gql} from "@apollo/client"
import React, { useEffect, useState } from "react"
import { copyGrids } from "../../../features/grids/gridsSlice"
import { useAppDispatch, useAppSelector } from "../../../features/hooks"
import { addGrid, deleteAllStructs } from "../../../features/sharedActions"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum"
import { BasicController } from "../BasicController"
import {ControllerProps} from "../controllerProps"
import { convertArrayToGrid } from "./gridControllerUtils"


type GetGridFromProblemExampleArgs = {
  number: number,
  example: number
}

type GetGridFromProblemExampleReturns = {
  
}



export const ShortestBridgeController = ({
  animationOn,
  play,
  pause,
  animationSpeed
}: ControllerProps) => {
  const [example, setExample] = useState<number>(0);
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.grids[0] ? state.grids[0].cells : []);
  const [getGrid, {loading, error, data}] = useLazyQuery(GET_GRID_FROM_PROBLEM_EXAMPLE);

  const clickSetUp = async () => {
    dispatch(deleteAllStructs());
    await getGrid({
      variables: {
        number: QUESTIONS_ENUM.SHORTEST_BRIDGE,
        example: example
      }
    });
    setExample(example + 1);
  }

  useEffect(() => {
    console.log(data);
    console.log(loading);
    if (data) {
      const {interpretAs} = data.problem.grids[0]
      const grid = convertArrayToGrid(data.problem.grids[0].data, interpretAs);
      console.log(grid);
      dispatch(copyGrids([grid]));
    }
  }, [loading, data])

  return (
    <BasicController
      label={"Label For Shortest Bridge Problem"}
      play={() => console.log("Play")}
      setup={clickSetUp}
      pause={() => console.log("Pause")}
      step={() => console.log("Step")}
    />
  )
}