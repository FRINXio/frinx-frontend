import React, { Component } from 'react';
import './App.css';
import List from './components/uniconfig/deviceTable/List'
import DeviceView from './components/uniconfig/deviceView/DeviceView'

class App extends Component {
  render() {
      if(window.location.pathname.split("/")[1] === 'edit') {
        return (
          <div className="App">
            <DeviceView datasetId={window.location.pathname.split("/")[2]} />
          </div>
        )
      } else {
        if(window.location.pathname !== "/") {
          window.location.pathname = "/"
        }
        return (
          <div className="App">
            <List />
          </div>
        )
      }
  }
}

export default App;
