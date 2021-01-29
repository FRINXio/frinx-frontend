import ResourceManagerStateWrapper from './ResourceManagerStateWrapper';
import AllocationStrategies from './configure/AllocationStrategies';
import theme from './components/layout/theme';
import ResourceTypes from './resourceTypes/ResourceTypes';
import Pools from './pools/Pools';
import ResourceList from './pools/resources/ResourcesList';
import PoolDetailPage from './pools/PoolsPage/Details/PoolDetailPage';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';

export { AllocationStrategies }
export { ResourceTypes }
export { Pools }
export { ResourceList }
export { PoolDetailPage }
export { SnackbarProvider }
export { ThemeProvider }


export { ResourceManagerStateWrapper }
// export { Pools }

export default {
    RootComponent: ResourceManagerStateWrapper,
};

// ReactDOM.render(
//     <ResourceManagerStateWrapper />,
//         document.getElementById('root'),
// );
