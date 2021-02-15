import { FC } from 'react';

declare module '@frinx/services-ui' {
  export const FoundOnNetworkPage: FC;
  export const ServicesWrapper: FC;
  export const DeviceDiscoveryApp: FC<{ onNewJobClick: () => void }>;
  export const ScanPage: FC<{ onStartScanClick: () => void }>;
}
