import React, { Component } from 'react';
import './App.css';
import Dashboard from "./components/dashboard/Dashboard";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import Header from "./components/header/Header";
import TaskList from "./components/tasks/taskList/TaskList";
import WorkflowList from "./components/workflows/WorkflowList/WorkflowList";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";

const routing = (
    <Router>
            <Switch>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/registration" component={Registration}/>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/devices" component={List} />
                <Route path="/devices/edit/:id" component={DeviceView} />
                <Route path="/tasks" component={TaskList} />
                <Route exact path="/workflows/:type" component={WorkflowList} />
                <Route exact path="/workflows/:type/:wfid" component={WorkflowList} />
            </Switch>
    </Router>
);

class App extends Component {

    render() {
        return (
            <div className="App">
                <Header username="Admin"/>
                {routing}
            </div>
        )
    }
}

export default App;
