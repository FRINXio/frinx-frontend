import React from 'react';
import { render } from 'react-dom';
import Root from './root';

const mountElement = document.querySelector('#root');

if (mountElement == null) {
  throw new Error('#root element not found');
}

render(React.createElement(Root), mountElement);
