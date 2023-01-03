import { useAppDispatch } from "../../features/hooks";
import { deleteAllStructs } from "../../features/sharedActions";
import { changeProblemNumber } from "../../features/problemInfo/problemSlice";
import { clearLog } from "../../features/problemInfo/problemSlice";
import {useEffect} from "react"

/**
 * Deletes all structs, changes problem number, and clears the log.
 * @param dispatch Dispatch function.
 * @param problemNumber Number of new problem.
 */

export type ANIMATION_PROPS = {
    animationOn: boolean,
    animationSpeed: number,
    play: () => void,
    pause: () => void
}