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
import React, { useState } from 'react';
import { QueryRenderer } from 'react-relay';
// eslint-disable-next-line import/extensions
import environment from '../../environment.js';

type Props = {
  query: any,
  variables: Object,
  render: (props: Object) => React$Element<any> | null,
};

const ResourceManagerQueryRenderer = (compProps: Props) => {
  const { query, variables } = compProps;
  const [, setErrorPresent] = useState(false);

  return (
    <QueryRenderer
      environment={environment}
      query={query}
      variables={variables}
      render={({ error, props }) => {
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
