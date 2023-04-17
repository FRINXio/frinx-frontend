import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Topology from './pages/topology/topology';
import StateProvider from './state.provider';

const Root = () => {
  return (
    <StateProvider>
      <Routes>
        <Route index element={<Topology />} />
      </Routes>
    </StateProvider>
  );
};

export default Root;
