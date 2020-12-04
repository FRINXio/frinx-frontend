import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
  mutation AddResourceTypeMutation($input: CreateResourceTypeInput!) {
    CreateResourceType(input: $input) {
      resourceType {
        Name
      }
    }
  }
`;

export default (variables, callbacks) => {
  console.log(variables);
  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: (response) => {
      callbacks(response);
      console.log('Response received from server.');
    },
    onError: (err) => callbacks(null, err),
  });
};
