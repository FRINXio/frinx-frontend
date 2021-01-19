import React, { FC, useEffect, useRef } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Dashboard from './dashboard/Dashboard';
import Header from './header/Header';
import 'react-notifications/lib/notifications.css';
import { createPublicClientApp } from './auth-helpers';
import { WorkflowApp } from 'frinx-workflow-ui/dist';

function setMessages() {
  const urlParams = new URLSearchParams(window.location?.search);
  const message = urlParams.get('message');
  const messageLevel = urlParams.get('message_level');

  // TODO this causes a warning in browser
  // Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node

  if (message) {
    switch (messageLevel) {
      default:
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message);
        break;
      case 'warning':
        NotificationManager.warning(message);
        break;
      case 'error':
        NotificationManager.error(message);
        break;
    }
  }
}

const AppWithAuth = () => {
  const publicClientAppRef = useRef<PublicClientApplication>(createPublicClientApp());

  return (
    <MsalProvider instance={publicClientAppRef.current}>
      <Header isAuthEnabled />
      <Dashboard />
      <NotificationContainer />
    </MsalProvider>
  );
};

const App: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  useEffect(() => {
    setMessages();
  }, []);

  return isAuthEnabled ? (
    <AppWithAuth />
  ) : (
    <>
      <Router>
        <Header isAuthEnabled={false} />
        {/* <Dashboard />
      <NotificationContainer correlationId="notificationContainer" /> */}
        <Switch>
          <Route path="/uniflow/ui">
            <WorkflowApp />
          </Route>
          <Route exact path="/">
            <h4>Dashboard</h4>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
