import React, {useEffect, useState} from "react"
import { useQuery } from "@apollo/client"
import { convertArrayToGrid } from "./gridControllerUtils";
import { useGetGridFromProblemExampleLazyQuery } from "../../../../__generated__/resolvers-types";
import { useAppDispatch } from "../../../../features/hooks";
import { copyGrids } from "../../../../features/grids/gridsSlice";
import { GridCreationLog } from "./logUtils";
import { pushJSXToLog } from "../../../../features/problemInfo/problemSlice";

export const useGetGridFromProblem = (gridIndex: number) => {
  const dispatch = useAppDispatch();
  const [getGrid, gridClient] = useGetGridFromProblemExampleLazyQuery();
  const [example, setExample] = useState<number>(0);

  useEffect(() => {
    //TODO: This is a bad way to deal with undefined
    if (
      gridClient.data && 
      gridClient.data.problem && 
      gridClient.data.problem.grids && 
      gridClient.data.problem.grids[0]
    ) {
      const {interpretAs, gridData, label} = gridClient.data.problem.grids[0];
      //TODO: This is also bad
      const grid = convertArrayToGrid(gridData as number[][], interpretAs as "NUMBER" | "BOOLEAN" | "NORMALIZED");
      dispatch(copyGrids([grid]));
      setExample((example + 1) % gridClient.data.problem.numExamples);
      const element = (
        <GridCreationLog
          dispatch={dispatch}
          numStructs={3}
          labels={[label ? label : "Grid #1"]}
        />
      );
      dispatch(pushJSXToLog({element: element}));
    }
  }, [gridClient])

  return [getGrid, example];

}