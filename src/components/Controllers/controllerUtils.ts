import { useAppDispatch } from "../../features/hooks";
import { deleteAllStructs } from "../../features/sharedActions";
import { changeProblemNumber } from "../../features/problemInfo/problemSlice";
import { clearLog } from "../../features/problemInfo/problemSlice";

/**
 * Deletes all structs, changes problem number, and clears the log.
 * @param dispatch Dispatch function.
 * @param problemNumber Number of new problem.
 */
export const clearState = (dispatch: any, problemNumber: number) => {
    dispatch(deleteAllStructs());
    dispatch(changeProblemNumber({problemNumber: problemNumber}));
    dispatch(clearLog());
}