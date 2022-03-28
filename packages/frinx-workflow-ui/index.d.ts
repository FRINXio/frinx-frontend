import { FC } from 'react';
import { UniflowApiCallbacks } from './src/uniflow-api-provider';

declare module '@frinx/workflow-ui' {
  export const ReduxProvider: FC;
  export const getUniflowApiProvider: (callbacks: UniflowApiCallbacks) => FC;
  export const UniflowApp: VoidFunctionComponent;
}
