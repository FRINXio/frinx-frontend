import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

class GammaApp {
  private isInitialized = false;

  async init() {
    if (this.isInitialized) {
      throw new Error('Gamma is already initialized');
    }
    this.isInitialized = true;

    return this;
  }

  render() {
    ReactDOM.render(
      React.createElement(React.StrictMode, null, React.createElement(App)),
      document.getElementById('root'),
    );
  }
}

window.gammaApp = new GammaApp();
