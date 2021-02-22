import { createElement } from 'react';
import App from './App';
import DeviceView from './components/uniconfig/deviceView/DeviceView';
import DeviceList from './components/uniconfig/deviceTable/DeviceList';
import { ThemeProvider as Provider } from '@material-ui/core/styles';
import DeviceDetails from './components/uniconfig/deviceTable/DeviceDetails';
import MountDevice from './components/uniconfig/deviceTable/mount/MountDevice';
import theme from './components/common/theme';
import { getUniconfigApiProvider } from './UniconfigApiProvider';

export { App as UniconfigApp };
export { DeviceList };
export { DeviceView };

export { DeviceDetails };
export { MountDevice };

export { getUniconfigApiProvider };

export const ThemeProvider = ({ children }) => {
  return createElement(Provider, { theme }, children);
};

export const menuLinks = [{ label: 'Devices', path: '/devices' }];

export default {
  RootComponent: App,
  menuLinks,
};
