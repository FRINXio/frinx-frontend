import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
  mutation AddStrategyMutation($input: CreateAllocationStrategyInput!) {
    CreateAllocationStrategy(input: $input) {
        strategy{
            id
           Name
           Lang
           Script
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
