import App from "./App";
import List from './components/uniconfig/deviceTable/List';
import DeviceView from './components/uniconfig/deviceView/DeviceView';

export { List };
export { DeviceView };
export { App as UniConfigApp };

export const menuLinks = [
  { label: 'Devices', path: '/devices' }
];

export default {
  RootComponent: App,
  menuLinks
}