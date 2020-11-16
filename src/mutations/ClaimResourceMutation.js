import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
    mutation ClaimResourceMutation($poolId: ID!, $description: String, $userInput: Map!) {
        ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
            id
        }
    }
`;

export default (variables, callbacks) => {
  console.log(variables);
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
