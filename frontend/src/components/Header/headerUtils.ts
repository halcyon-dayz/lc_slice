import { clearState } from "../../utils/clearState";

export type ProblemDropdownType = {
  title: string,
  action: () => void,
  problemNumber: number,
}

export const  constructProblemDropdown = (
  problems: string[], 
  dispatch: any
): ProblemDropdownType[] => {
  return problems.map((problem, idx) => {
    let number = parseInt(problem.split(".")[0]);
    return {
      title: problem, 
      problemNumber: number,
      action: () => {
        clearState(dispatch, number);
      }
    }
  })
}