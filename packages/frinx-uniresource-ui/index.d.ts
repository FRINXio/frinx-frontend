import { FC } from 'react';

declare module '@frinx/uniresource-ui' {
  export const PoolsList: FC;
  export const StrategiesList: FC<{ onAddButtonClick: () => void }>;
  export const ResourceTypesList: FC;
  export const UniresourceAppProvider: FC;
  export const CreateNewStrategy: FC<{ onSaveButtonClick: () => void }>;
  export const CreateNestedPool: FC;
}
