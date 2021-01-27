import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import {
  GlobalProvider,
  globalConstants,
} from "./components/common/GlobalContext";
import DeviceList from "./components/uniconfig/deviceTable/DeviceList";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./components/common/theme";
import DeviceDetails from "./components/uniconfig/deviceTable/DeviceDetails";
import Breadcrumb from "./components/common/Breadcrumb";
import MountDevice from "./components/uniconfig/deviceTable/mount/MountDevice";

const { frontendUrlPrefix } = globalConstants;

function App(props) {
  return (
    <GlobalProvider {...props}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route
            exact
            path={
              (props.frontendUrlPrefix || frontendUrlPrefix) +
              "/devices/edit/:id"
            }
            component={DeviceView}
          />
          <>
            <Breadcrumb />
            <Route
              exact
              path={(props.frontendUrlPrefix || frontendUrlPrefix) + "/devices"}
              component={DeviceList}
            />
            <Route
              exact
              path={
                (props.frontendUrlPrefix || frontendUrlPrefix) +
                "/devices/:nodeId"
              }
              component={DeviceDetails}
            />
            <Route
              exact
              path={(props.frontendUrlPrefix || frontendUrlPrefix) + "/mount"}
              component={MountDevice}
            />
            <Redirect
              to={(props.frontendUrlPrefix || frontendUrlPrefix) + "/devices"}
            />
          </>
        </Switch>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;
