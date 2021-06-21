import { Device } from './helpers/types';
import unwrap from './helpers/unwrap';

export type Callbacks = {
  getDevices: () => Promise<Device[]>;
};

class CallbackUtils {
  private getDevices: (() => Promise<Device[]>) | null = null;

  setCallbacks = (callbacks: Callbacks): void => {
    if (this.getDevices == null) {
      this.getDevices = callbacks.getDevices;
    }
  };

  getDevicesCallback = () => unwrap(this.getDevices);
}

export default new CallbackUtils();
