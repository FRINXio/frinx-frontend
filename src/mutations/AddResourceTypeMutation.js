import {commitMutation, graphql} from 'react-relay';
import RelayEnvironment from "../utils/relay/ResourceManagerRelayEnvironment";

const mutation = graphql`
    mutation AddResourceTypeMutation(
        $resourceName: String!,
        $resourceProperties: Map!,
    ) {
        CreateResourceType(resourceName: $resourceName, resourceProperties: $resourceProperties) {
            ID
            Name
        }
    }
`;

export default (resourceName, resourceProperties) => {
    const variables = {
        resourceName, resourceProperties
    };

    console.log(variables);

    commitMutation(
        RelayEnvironment,
        {
            mutation,
            variables,
            onCompleted: (response, errors) => {
                console.log('Response received from server.')
            },
            onError: err => console.error(err),
        },
    );
}