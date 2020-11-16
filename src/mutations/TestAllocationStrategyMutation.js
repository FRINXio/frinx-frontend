import { commitMutation, graphql } from 'react-relay';
import environment from '../environment';

const mutation = graphql`
    mutation TestAllocationStrategyMutation( $allocationStrategyId: ID!, $resourcePool: ResourcePoolInput!,
        $currentResources: [ResourceInput!]!, $userInput: Map!) {
        TestAllocationStrategy(allocationStrategyId: $allocationStrategyId, resourcePool: $resourcePool,
            currentResources: $currentResources, userInput: $userInput)
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
