import { Device } from './helpers/types';
import unwrap from './helpers/unwrap';

export type Callbacks = {
  getDevices: () => Promise<Device[]>;
  getZones: () => Promise<{ id: string; name: string }[]>;
  addDevice: (params: { name: string; zoneId: string; mountParameters?: string }) => Promise<void>;
  installDevice: (deviceId: string) => Promise<void>;
  uninstallDevice: (deviceId: string) => Promise<void>;
};

class CallbackUtils {
  private getDevices: (() => Promise<Device[]>) | null = null;

  private getZones: (() => Promise<{ id: string; name: string }[]>) | null = null;

  private addDevice: ((params: { name: string; zoneId: string; mountParameters?: string }) => Promise<void>) | null =
    null;

  private installDevice: ((deviceId: string) => Promise<void>) | null = null;

  private uninstallDevice: ((deviceId: string) => Promise<void>) | null = null;

  setCallbacks = (callbacks: Callbacks): void => {
    if (this.getDevices == null) {
      this.getDevices = callbacks.getDevices;
    }

    if (this.getZones == null) {
      this.getZones = callbacks.getZones;
    }

    if (this.addDevice == null) {
      this.addDevice = callbacks.addDevice;
    }

    if (this.installDevice == null) {
      this.installDevice = callbacks.installDevice;
    }

    if (this.uninstallDevice == null) {
      this.uninstallDevice = callbacks.uninstallDevice;
    }
  };

  getDevicesCallback = () => unwrap(this.getDevices);

  getZonesCallback = () => unwrap(this.getZones);

  getAddDeviceCallback = () => unwrap(this.addDevice);

  getInstallDeviceCallback = () => unwrap(this.installDevice);

  getUninstallDeviceCallback = () => unwrap(this.uninstallDevice);
}

export default new CallbackUtils();
