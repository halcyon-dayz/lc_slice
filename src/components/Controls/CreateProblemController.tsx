import React from "react"
import { Problem733Controller } from "../Controllers/Problem733"
import {Problem417Controller} from "../Controllers/Problem417"

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
        default: {
            return (
                <h1>Invalid Problem Selected</h1>
            )
        }
    }
}