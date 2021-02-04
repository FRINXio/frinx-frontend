import { FC } from 'react';

declare module '@frinx/uniconfig-ui' {
  export const DeviceList: FC<{
    onMountBtnClick: (mountTemplate: any) => void;
    onDeviceClick: (deviceId: string, topologyId: string) => void;
    onEditClick: (deviceId: string) => void;
  }>;
  export const DeviceView: FC<{ deviceid: string; onBackBtnClick: () => void }>;
  export const ThemeProvider: FC;
  export const DeviceDetails: FC<{ onBackBtnClick: () => void }>;
  export const MountDevice: FC<{ onBackBtnClick: () => void; templateNode: any }>;
}
