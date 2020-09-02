/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import axios from 'axios';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';

function handleDeactivatedUser(error) {
  const errorResponse = error?.response;

  throw error;
}

const BASIC_URL = 'http://0.0.0.0:5000/graphql/query';

const headers = {
  "x-tenant-id": "fb",
  "x-auth-user-role": "OWNER",
  "from": "fb-user@frinx.io"
};

function fetchQuery(query) {
  return axios
    .post(
      BASIC_URL,
      {
        query: query.text,
      },
      {headers},
    )
    .then(response => {
      return response.data;
    })
    .catch(handleDeactivatedUser);
}

const RelayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default RelayEnvironment;
