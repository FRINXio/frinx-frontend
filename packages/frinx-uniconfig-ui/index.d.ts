import { FC } from 'react';

declare module '@frinx/uniconfig-ui' {
  export const DeviceList: FC;
  export const DeviceView: FC;
  export const ThemeProvider: FC<{ theme: Theme }>;
  export const DeviceDetails: FC;
  export const Breadcrumb: FC;
  export const MountDevice: FC;
}
