import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Topology from './pages/topology/topology';

const Root = () => {
  return (
    <Routes>
      <Route index element={<Topology />} />
    </Routes>
  );
};

export default Root;
