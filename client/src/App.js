import React, { useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import KibanaFrame from "./components/dashboard/KibanaFrame";
import Header from "./components/header/Header";
import TaskList from "./components/tasks/taskList/TaskList";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import SubApp from "./components/workflows/frinx-workflow-ui/src/App";

function App() {
  const [isBuilderActive, setIsBuilderAcive] = useState(false);

  let routes = (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/devices" component={List} />
      <Route path="/devices/edit/:id" component={DeviceView} />
      <Route path="/tasks" component={TaskList} />
      <Route
        exact
        path={[
          "/workflows/builder",
          "/workflows/builder/:name/:version",
          "/workflows/:type",
          "/workflows/:type/:wfid",
        ]}
        render={() => <SubApp setBuilderActive={setIsBuilderAcive} />}
      />
      <Route exact path="/inventory" component={KibanaFrame} />
    </Switch>
  );

  return (
    <div className="App">
      {isBuilderActive ? null : <Header />}
      {routes}
    </div>
  );
}

export default withRouter(App);
