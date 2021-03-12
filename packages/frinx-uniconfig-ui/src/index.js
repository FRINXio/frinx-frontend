import App from './App';
import DeviceView from './components/uniconfig/device-view/device-view';
import DeviceList from './components/uniconfig/device-table/device-list';
import DeviceDetails from './components/uniconfig/device-table/device-details';
import MountDevice from './components/uniconfig/device-table/mount/mount-device';
import { getUniconfigApiProvider } from './uniconfig-api-provider';

export { App as UniconfigApp };
export { DeviceList };
export { DeviceView };

export { DeviceDetails };
export { MountDevice };

export { getUniconfigApiProvider };

export const menuLinks = [{ label: 'Devices', path: '/devices' }];

export default {
  RootComponent: App,
  menuLinks,
};
