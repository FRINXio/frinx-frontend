import {commitMutation, graphql} from 'react-relay';
import RelayEnvironment from "../utils/relay/ResourceManagerRelayEnvironment";

const mutation = graphql`
    mutation DeleteResourceTypeMutation(
        $resourceTypeId: ID!,
    ) {
        DeleteResourceType(resourceTypeId: $resourceTypeId)
    }
`;

export default (resourceTypeId) => {
    const variables = {
        resourceTypeId
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