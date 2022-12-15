import React from "react"
import {PacificAtlanticWaterflowController, FloodFillController} from "../Controllers/GridControllers"
import { AllPathsFromSourceToTargetController } from "../Controllers/GraphControllers/AllPathsFromSourceToTargetController"
import { QUESTIONS_ENUM } from "../../utils/questionEnum"
import { ShortestBridgeController } from "../Controllers/GridControllers/ShortestBridgeController"
import { UniquePathsOne } from "../Controllers/GridControllers/UniquePathsOne"

type CreateProblemControllerProps = {
    problemNumber: number,
    animationOn: boolean,
    play: () => void,
    pause: () => void,
    animationSpeed: number,
}


export const CreateProblemController = ({
    problemNumber, 
    animationOn,
    play,
    pause,
    animationSpeed
}: CreateProblemControllerProps) => {
  switch(problemNumber) {
    case QUESTIONS_ENUM.UNIQUE_PATHS: {
      return (
        <UniquePathsOne 
          animationOn={animationOn}
          play={play}
          pause={pause}
          animationSpeed={animationSpeed}
        />
      )
    }
    case QUESTIONS_ENUM.PACIFIC_ATLANTIC_WATER_FLOW: {
      return (
        <PacificAtlanticWaterflowController 
          animationOn={animationOn}
          play={play}
          pause={pause}
          animationSpeed={animationSpeed} 
        />
      );
    }
    case QUESTIONS_ENUM.SHORTEST_BRIDGE: {
      return (
        <ShortestBridgeController 
          animationOn={animationOn}
          play={play}
          pause={pause}
          animationSpeed={animationSpeed}
        />
      )
    }
    case QUESTIONS_ENUM.FLOOD_FILL: {
      return (
        <FloodFillController
          animationOn={animationOn}
          play={play}
          pause={pause}
          animationSpeed={animationSpeed}
        />
      );
    }
    case QUESTIONS_ENUM.ALL_PATHS_FROM_SOURCE_TO_TARGET: {
      return (
        <AllPathsFromSourceToTargetController
          animationOn={animationOn}
          play={play}
          pause={pause}
          animationSpeed={animationSpeed}
        />
      )
    }
    default: {
      return (
        <h1>Invalid Problem Selected</h1>
      )
    }
  }
}