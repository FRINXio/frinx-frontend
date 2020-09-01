import {
    Environment,
    Network,
    RecordSource,
    Store,
} from 'relay-runtime';

function fetchQuery(
    operation,
    variables,
) {
    //TODO headers
    return fetch('/graphql/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-tenant-id": "fb",
            "x-auth-user-role": "OWNER",
            "from": "fb-user@frinx.io",
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    }).then(response => {
        return response.json();
    });
}

const environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

export default environment;
