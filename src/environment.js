import {
  Environment,
  Network,
  RecordSource,
  Store,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'relay-runtime';

function fetchQuery(
  operation,
  variables,
) {
  return fetch('/resourcemanager/graphql/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => response.json());
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
