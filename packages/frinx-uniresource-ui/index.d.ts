// import { SnackbarProvider } from 'notistack';
// import ResourceManagerStateWrapper from './ResourceManagerStateWrapper';
// import AllocationStrategies from './configure/AllocationStrategies';
// import theme from './components/layout/theme';
// import ResourceTypes from './resourceTypes/ResourceTypes';
// import Pools from './pools/Pools';
// import ResourceList from './pools/resources/ResourcesList';
// import PoolDetailPage from './pools/PoolsPage/Details/PoolDetailPage';
// import { ThemeProvider } from '@material-ui/styles';

// export { AllocationStrategies }
// export { ResourceTypes }
// export { Pools }
// export { ResourceList }
// export { PoolDetailPage }
// export { ThemeProvider }
// export { SnackbarProvider }

import { FC } from 'react';

declare module '@frinx/uniresource-ui' {
    export const SnackbarProvider: FC;
    export const ResourceTypes: FC;
    export const Pools: FC;
    export const ResourceList;
    export const PoolDetailPage: FC;
    export const ThemeProvider: FC;
    export const AllocationStrategies: FC;
    export const ResourceManagerStateWrapper: FC;
}

