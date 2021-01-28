import { FC } from 'react';

declare module '@frinx/uniconfig-ui' {
  export const List: FC<{ onEditBtnClick: (id: string) => void }>;
  export const DeviceView: FC;
}
