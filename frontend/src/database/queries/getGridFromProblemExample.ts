import { gql } from "@apollo/client";

export const GET_GRID_FROM_PROBLEM_EXAMPLE = gql`
  query TestQuery($number: Int, $example: NonNegativeInt) {
    problem(number: $number) {
      title
      grids(example: $example) {
        data
        interpretAs
      }
    }
  }
`;