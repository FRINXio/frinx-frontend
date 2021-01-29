// @flow
import * as React from 'react';
import { StateProvider, useStateValue } from './utils/StateProvider';
import ResourceManagerTabs from './ResourceManagerTabs';

const ResourceManagerStateWrapper = (props) => {
  const { children } = props
  const initialState = {
    isAdmin: true,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeIsAdmin':
        return {
          ...state,
          isAdmin: action.newIsAdmin,
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      { children }
    </StateProvider>
  );
};

export default ResourceManagerStateWrapper;
