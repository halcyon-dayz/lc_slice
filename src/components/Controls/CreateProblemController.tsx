import React from "react"
import { Problem733Controller } from "../Controllers/Problem733"
import {Problem417Controller} from "../Controllers/Problem417"
import { AllPathsFromSourceToTargetController } from "../Controllers/GraphControllers/AllPathsFromSourceToTargetController"
import { QUESTIONS_ENUM } from "../../utils/questionEnum"

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
        case 417: {
            return (
                <Problem417Controller 
                    animationOn={animationOn}
                    play={play}
                    pause={pause}
                    animationSpeed={animationSpeed} 
                />
            );
        }
        case 733: {
            return (
                <Problem733Controller
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