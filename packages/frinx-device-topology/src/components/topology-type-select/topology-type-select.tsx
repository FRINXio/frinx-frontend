import { Button, Flex, FormControl, FormLabel, Select } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { MapTopologyType, setMapTopologyType, setTopologyLayer } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { TopologyLayer } from '../../state.reducer';

type Layer = {
  name: string;
  value: 'PHYSICAL_TOPOLOGY' | 'PTP_TOPOLOGY' | 'ETH_TOPOLOGY' | 'NETWORK_TOPOLOGY' | 'MPLS_TOPOLOGY';
  layer: TopologyLayer;
};

export const topologyLayers: Layer[] = [
  { name: 'Physical Topology', value: 'PHYSICAL_TOPOLOGY', layer: 'LLDP' },
  { name: 'Ptp Topology', value: 'PTP_TOPOLOGY', layer: 'PTP' },
  { name: 'Eth Topology', value: 'ETH_TOPOLOGY', layer: 'Synchronous Ethernet' },
  { name: 'Mpls Topology', value: 'MPLS_TOPOLOGY', layer: 'MPLS' },
];

const TopologyTypeSelect: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { mapTopologyType } = state;

  const handleTopologyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MapTopologyType;
    dispatch(setMapTopologyType(value));
  };

  const handleSwitchLayer = () => {
    const layer = topologyLayers.find((l) => l.value === mapTopologyType);
    if (mapTopologyType && layer) {
      dispatch(setTopologyLayer(layer.layer));
      dispatch(setMapTopologyType(null));
    }
  };

  return (
    <FormControl paddingBottom="24px">
      <FormLabel marginBottom={4}>Select topology type:</FormLabel>
      <Flex gap={2}>
        <Select
          width="300px"
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
        <Button isDisabled={!mapTopologyType} onClick={handleSwitchLayer} colorScheme="blue">
          Switch layer
        </Button>
      </Flex>
    </FormControl>
  );
};

export default TopologyTypeSelect;
