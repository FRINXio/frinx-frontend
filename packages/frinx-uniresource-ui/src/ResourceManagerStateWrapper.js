// @flow
import * as React from 'react';
import { StateProvider, useStateValue } from './utils/StateProvider';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';

const ResourceManagerStateWrapper = (props) => {
  const { children } = props;
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
      <ThemeProvider theme={}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </StateProvider>
  );
};

export default ResourceManagerStateWrapper;
