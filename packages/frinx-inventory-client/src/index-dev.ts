import { createElement } from 'react';
import { render } from 'react-dom';
import DeviceList from './pages/device-list/device-list';

const mountElement = document.querySelector('#root');

if (mountElement == null) {
  throw new Error('#root element not found');
}

render(createElement(DeviceList), mountElement);
