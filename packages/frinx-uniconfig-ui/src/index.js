import App from './App';
import DeviceView from './components/uniconfig/deviceView/DeviceView';
import DeviceList from './components/uniconfig/deviceTable/DeviceList';
import { ThemeProvider } from '@material-ui/core/styles';
import DeviceDetails from './components/uniconfig/deviceTable/DeviceDetails';
import Breadcrumb from './components/common/Breadcrumb';
import MountDevice from './components/uniconfig/deviceTable/mount/MountDevice';
import theme from "./components/common/theme";

export { App as UniconfigApp };
export { DeviceList };
export { DeviceView };
export { ThemeProvider };
export { theme };
export { DeviceDetails };
export { Breadcrumb };
export { MountDevice };

export const menuLinks = [{ label: 'Devices', path: '/devices' }];

export default {
  RootComponent: App,
  menuLinks,
};
