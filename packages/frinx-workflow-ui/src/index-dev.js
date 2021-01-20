// @flow
import App from './App';
import ServiceUIApp from './ServiceUiApp';
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// TODO remove
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/uniflow/ui">
        <App />
      </Route>
      <Route exact path="/">
        <h1>Dashboard</h1>
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root'),
);
