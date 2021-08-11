import { FC } from 'react';

declare module '@frinx/inventory-client' {
  export const DeviceList: FC<{
    onAddButtonClick: () => void;
  }>;
  export const CreateDevicePage: FC<{
    onAddDeviceSuccess: () => void;
  }>;
  export const getInventoryApiProvider: (callbacks: unknown) => FC;
  export const InventoryApiProvider: FC;
}
