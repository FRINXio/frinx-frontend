import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import KibanaFrame from "./components/dashboard/KibanaFrame";
import Header from "./components/header/Header";
import TaskList from "./components/tasks/taskList/TaskList";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import SubApp from "frinx-workflow-ui/lib/App";

const conductorApiUrlPrefix = "/api/conductor";
const frontendUrlPrefix = "/workflows";

function App() {

  let routes = (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/devices" component={List} />
      <Route path="/devices/edit/:id" component={DeviceView} />
      <Route path="/tasks" component={TaskList} />
      <Route exact path="/inventory" component={KibanaFrame} />
      <Route
        exact
        path={[
          "/workflows/builder",
          "/workflows/builder/:name/:version",
          "/workflows/:type",
          "/workflows/:type/:wfid",
        ]}
        render={() => <SubApp
          frontendUrlPrefix={frontendUrlPrefix}
          backendApiUrlPrefix={conductorApiUrlPrefix}
          enableScheduling={false} />
        }
      />
    </Switch>
  );

  return (
    <div className="App">
      <Route
        exact
        path={[
          "/",
          "/devices",
          "/devices/edit/:id",
          "/tasks*",
          "/inventory"
        ]}
        component={Header}
      />
      {routes}
    </div>
  );
}

export default withRouter(App);
