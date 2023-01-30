import React, { VoidFunctionComponent } from 'react';
import StateProvider from '../../state.provider';
import TopologyContainer from './topology-container';

const Topology: VoidFunctionComponent = () => {
  return (
    <StateProvider>
      <TopologyContainer />
    </StateProvider>
  );
};

export default Topology;
