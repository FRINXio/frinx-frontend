import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { isAuthEnabled } from './auth-helpers';

ReactDOM.render(
  React.createElement(React.StrictMode, null, React.createElement(App, { isAuthEnabled: isAuthEnabled() })),
  document.getElementById('root'),
);
