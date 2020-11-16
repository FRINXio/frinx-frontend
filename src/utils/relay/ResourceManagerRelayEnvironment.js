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
import {
  Environment, Network, RecordSource, Store,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'relay-runtime';

function handleDeactivatedUser(error) {
  throw error;
}

const BASIC_URL = '/resourcemanager/graphql/query';

function fetchQuery(query) {
  return axios
    .post(
      BASIC_URL,
      {
        query: query.text,
      },
      {},
    )
    .then((response) => response.data)
    .catch(handleDeactivatedUser);
}

const RelayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default RelayEnvironment;
