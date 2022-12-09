import { useQuery, gql, useMutation} from "@apollo/client"

const addGridMutationString = gql`
  mutation($input: AddGridInput!) {
    addGrid(input: $input) {
      data
      gridId
      fromExample
      exampleIndex
      problemNumber
      interpretAs
    }
  }


`

export const useAddGridMutation = (
  lazy: boolean,
  data: boolean[][] | number[][],
) => {

  return useMutation(addGridMutationString, {

  })

}