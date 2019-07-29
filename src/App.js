import React, { Component } from 'react';
import './App.css';
import Dashboard from "./components/dashboard/Dashboard";
import {Redirect, Route, Switch} from "react-router-dom";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import Header from "./components/header/Header";
import TaskList from "./components/tasks/taskList/TaskList";
import WorkflowList from "./components/workflows/WorkflowList/WorkflowList";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import {connect} from "react-redux";
import Logout from "./components/auth/Logout";
import * as authActions from './store/actions/auth';
import KibanaFrame from "./components/dashboard/KibanaFrame";


class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {

        let routes = (
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/registration" component={Registration}/>
                <Redirect exact from="/" to="/login"/>
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/devices" component={List}/>
                    <Route path="/devices/edit/:id" component={DeviceView}/>
                    <Route path="/tasks" component={TaskList}/>
                    <Route exact path="/workflows/:type" component={WorkflowList}/>
                    <Route exact path="/workflows/:type/:wfid" component={WorkflowList} />
                    <Route exact path="/inventory" component={KibanaFrame}/>
                    <Route path="/logout" component={Logout}/>
                    <Redirect exact from="/login" to="/"/>
                    <Redirect exact from="/registration" to="/"/>
                </Switch>
            )
        }

        return (
            <div className="App">
                {this.props.isAuthenticated ? <Header email={this.props.userEmail}/> : null}
                {routes}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.token !== null,
        userEmail: state.authReducer.email
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(authActions.authCheckState())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
