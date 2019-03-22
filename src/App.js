import React, { Component } from 'react';
import './App.css';
import List from './components/List'
import Editor from './components/Editor'

class App extends Component {
  render() {
      if(window.location.pathname.split("/")[1] == 'edit') {
        return (
          <div className="App">
            <Editor datasetId={window.location.pathname.split("/")[2]} />
          </div>
        )
      } else {
        if(window.location.pathname != "/") {
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
