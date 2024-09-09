import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { MapTopologyType, setMapTopologyType } from '../../state.actions';
import { useStateContext } from '../../state.provider';

const TopologyTypeSelect: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { mapTopologyType } = state;

  const topologyLayers = [
    { name: 'Physical Topology', value: 'PHYSICAL_TOPOLOGY' },
    { name: 'Ptp Topology', value: 'PTP_TOPOLOGY' },
    { name: 'Eth Topology', value: 'ETH_TOPOLOGY' },
    { name: 'Mpls Topology', value: 'MPLS_TOPOLOGY' },
  ];

  const handleTopologyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MapTopologyType;
    dispatch(setMapTopologyType(value));
  };

  return (
    <FormControl width="sm" paddingBottom="24px">
      <FormLabel marginBottom={4}>Select topology type:</FormLabel>
      <Select
        data-cy="select-topology-type"
        placeholder="Select topology type"
        background="white"
        onChange={handleTopologyTypeChange}
        value={mapTopologyType || ''}
      >
        {topologyLayers.map((layer) => (
          <option key={layer.value} value={layer.value}>
            {layer.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default TopologyTypeSelect;
