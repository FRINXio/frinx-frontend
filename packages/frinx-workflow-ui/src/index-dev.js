// @flow
import App from './App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import unwrap from './helpers/unwrap';

const root = createRoot(unwrap(document.getElementById('root')));

// TODO remove Router
root.render(
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
);
