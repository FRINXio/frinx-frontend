import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
    mutation DeletePoolMutation($input: DeleteResourcePoolInput!) {
        DeleteResourcePool(input: $input) {
            resourcePoolId
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
