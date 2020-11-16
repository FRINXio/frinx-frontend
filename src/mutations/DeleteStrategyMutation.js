import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
    mutation DeleteStrategyMutation($input: DeleteAllocationStrategyInput!) {
        DeleteAllocationStrategy(input: $input) {
            strategy {
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
        console.log('Response received from server.');
      },
      onError: (err) => callbacks(null, err),
    },
  );
};
