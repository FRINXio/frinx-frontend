import React, { Component } from 'react';
import './App.css';
import Dashboard from "./components/dashboard/Dashboard";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import List from "./components/uniconfig/deviceTable/List";
import DeviceView from "./components/uniconfig/deviceView/DeviceView";
import Header from "./components/header/Header";

const routing = (
    <Router>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/devices" component={List} />
                <Route path="/devices/edit/:id" component={DeviceView} />
            </Switch>
    </Router>
);

class App extends Component {

    render() {
        return (
            <div className="App">
                <Header username="Admin" email="admin"/>
                {routing}
            </div>
        )
    }
}

export default App;
