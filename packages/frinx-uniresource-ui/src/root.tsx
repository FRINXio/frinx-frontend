import React, { VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ResourceTypesPage from './pages/resource-types-page/resource-types-page';
import NestedPoolsDetailPage from './nested-pools-detail-page/nested-pools-detail-page';
import CreatePoolPage from './pages/create-pool-page/create-pool-page';
import CreateStrategyPage from './pages/create-strategy-page/create-strategy-page';
import PoolDetailPage from './pages/pool-detail-page/pool-detail-page';
import PoolsPage from './pages/pools-page/pools-page';
import StrategiesPage from './pages/strategies-page/strategies-page';
import IpamPage from './pages/ipam-page/ipam-page';

const Root: VoidFunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route index element={<Navigate replace to="pools" />} />
      <Route path="ipam" element={<IpamPage />} />
      <Route path="pools" element={<PoolsPage />} />
      <Route path="pools/:poolId" element={<PoolDetailPage />} />
      <Route
        path="pools/new"
        element={
          <CreatePoolPage
            onCreateSuccess={() => {
              navigate('pools');
            }}
          />
        }
      />
      <Route path="pools/nested/:poolId" element={<NestedPoolsDetailPage />} />
      <Route path="strategies" element={<StrategiesPage />} />
      <Route
        path="strategies/new"
        element={
          <CreateStrategyPage
            onSaveButtonClick={() => {
              navigate('strategies');
            }}
          />
        }
      />
      <Route path="resource_types" element={<ResourceTypesPage />} />
    </Routes>
  );
};

export default Root;
