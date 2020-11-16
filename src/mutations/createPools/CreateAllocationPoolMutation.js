import { commitMutation, graphql } from 'react-relay';
import environment from '../../environment';

const mutation = graphql`
    mutation CreateAllocationPoolMutation($input: CreateAllocatingPoolInput!) {
        CreateAllocatingPool(input: $input) {
            pool {
                id
            }
        }
    }
`;

export default (variables, callbacks) => {
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response) => {
        callbacks(response);
      },
      onError: (err) => callbacks(null, err),
    },
  );
};
