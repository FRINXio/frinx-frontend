/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import CircularProgress from '@material-ui/core/CircularProgress';
import React, {useState} from 'react';
import RelayEnvironment from './ResourceManagerRelayEnvironment.js';
import {QueryRenderer} from 'react-relay';

type Props = {
  query: any,
  variables: Object,
  render: (props: Object) => React$Element<any> | null,
};


const ResourceManagerQueryRenderer = (compProps: Props) => {
  const {query, variables} = compProps;
  const [errorPresent, setErrorPresent] = useState(false);

  return (
    <QueryRenderer
      environment={RelayEnvironment}
      query={query}
      variables={variables}
      render={({error, props}) => {
        if (error) {
          setErrorPresent(true);
          return null;
        }

        if (!props) {
          return <CircularProgress />;
        }

        return compProps.render(props);
      }}
    />
  );
};

export default ResourceManagerQueryRenderer;
