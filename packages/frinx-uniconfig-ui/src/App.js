import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import {
  GlobalProvider,
  globalConstants,
} from "./components/common/GlobalContext";

const { frontendUrlPrefix } = globalConstants;

function App(props) {
  return (
    <div className="App">
      <GlobalProvider {...props}>
        <Header />
        <Switch>
          <Route
            exact
            path={(props.frontendUrlPrefix || frontendUrlPrefix) + "/devices"}
            component={List}
          />
          <Route exact path={(props.frontendUrlPrefix || frontendUrlPrefix) + "/devices/edit/:id"} component={DeviceView} />
          <Redirect to={(props.frontendUrlPrefix || frontendUrlPrefix) + "/devices"} />
        </Switch>
      </GlobalProvider>
    </div>
  );
}

export default withRouter(App);
