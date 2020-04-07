import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import Registration from "./components/auth/Registration";
import Dashboard from "./components/dashboard/Dashboard";
import KibanaFrame from "./components/dashboard/KibanaFrame";
import Header from "./components/header/Header";
import TaskList from "./components/tasks/taskList/TaskList";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import SubApp from "./components/workflows/frinx-workflow-ui/src/App";
import * as authActions from "./store/actions/auth";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBuilderActive: false,
    };
  }

  componentDidMount() {
    if (this.props.isAuthEnabled) {
      this.props.onTryAutoSignup();
    }
  }

  setBuilderActive() {
    this.setState({
      isBuilderActive: true,
    });
  }

  render() {
    let routes = null;

    if (this.props.isAuthEnabled) {
      routes = (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Redirect exact from="/" to="/login" />
        </Switch>
      );

      if (this.props.isAuthenticated) {
        routes = (
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
              render={() => (
                <SubApp setBuilderActive={this.setBuilderActive.bind(this)} />
              )}
            />
            <Route exact path="/inventory" component={KibanaFrame} />
            <Route path="/logout" component={Logout} />
            <Redirect exact from="/login" to="/" />
            <Redirect exact from="/registration" to="/" />
          </Switch>
        );
      }
    } else {
      routes = (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/devices" component={List} />
          <Route path="/devices/edit/:id" component={DeviceView} />
          <Route exact path="/tasks/:type" component={TaskList} />
          <Route
            exact
            path={[
              "/workflows/builder",
              "/workflows/builder/:name/:version",
              "/workflows/:type",
              "/workflows/:type/:wfid",
            ]}
            render={() => (
              <SubApp setBuilderActive={this.setBuilderActive.bind(this)} />
            )}
          />
          <Route exact path="/inventory" component={KibanaFrame} />
        </Switch>
      );
    }

    return (
      <div className="App">
        {this.state.isBuilderActive ? null : this.props.isAuthEnabled ? (
          this.props.isAuthenticated ? (
            <Header email={this.props.userEmail} />
          ) : (
            <Header email="Default user" />
          )
        ) : null}
        {routes}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthEnabled: process.env.REACT_APP_LOGIN_ENABLED !== "false",
    isAuthenticated: state.authReducer.token !== null,
    userEmail: state.authReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authActions.authCheckState()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App));
