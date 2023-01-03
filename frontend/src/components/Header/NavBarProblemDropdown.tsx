import FormControl from '@mui/material/FormControl';
import {InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import { ProblemDropdownType } from './headerUtils';

type NavBarProblemDropdownProps = {
  title: string,
  currentProblem: string,
  problems: ProblemDropdownType[],
  handleProblemChange: (event: SelectChangeEvent<string>) => void
}

export const NavBarProblemDropdown = ({
  title, 
  currentProblem,
  problems,
  handleProblemChange
}: NavBarProblemDropdownProps) => {
  return (
    <FormControl sx={{m: 1, minWidth: 200}} className="problems_form_control">
      <InputLabel id="grid_dropdown_select">Grid Problems</InputLabel>
      <Select labelId="grid_dropdown_select"
        id="grid_dropdown"
        value={currentProblem}
        label={title}
        onChange={handleProblemChange}
      >
      {problems.map((problem, idx) => (
        <MenuItem value={problem.problemNumber}>{problem.title}</MenuItem>
      ))}
      </Select>
    </FormControl>
  );
}