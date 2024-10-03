import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Select, Switch } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import React, { useState, VoidFunctionComponent } from 'react';
import { useClient } from 'urql';
import LabelsFilter from '../../components/labels-filter/labels-filter';
import VersionSelect from '../../components/version-select/version-select';
import { refreshCoordinates, setSelectedVersion, setSynceDiffVisibility, setTopologyLayer } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import { TopologyLayer } from '../../state.reducer';
import NetTopologyContainer from './net/net-topology.container';
import PtpTopologyContainer from './ptp/ptp-topology.container';
import TopologyContainer from './lldp/topology.container';
import SynceTopologyContainer from './synce/synce-topology.container';
import MplsTopologyContainer from './mpls/mpls-topology.container';
import MapTopologyContainer from './map/map-topology.container';
import TopologyTypeSelect from '../../components/topology-type-select/topology-type-select';
import DeviceSearch from '../../components/device-search/device-search';
import { TopologyType } from '../../__generated__/graphql';

const getTopologyType = (layer: TopologyLayer): TopologyType | null => {
  // TODO: In version 8.0 Net devices will have their own coordinates
  //       https://frinxhelpdesk.atlassian.net/browse/FR-360
  //       https://frinxhelpdesk.atlassian.net/browse/FR-361
  switch (layer) {
    case 'LLDP':
    case 'BGP-LS':
      return 'PHYSICAL_TOPOLOGY';
    case 'MPLS':
      return 'MPLS_TOPOLOGY';
    case 'PTP':
      return 'PTP_TOPOLOGY';
    case 'Synchronous Ethernet':
      return 'ETH_TOPOLOGY';
    case 'Map':
      return null;
    default:
      return null;
  }
};

const Topology: VoidFunctionComponent = () => {
  const client = useClient();
  const { state, dispatch } = useStateContext();
  const { mode, topologyLayer, isSynceDiffVisible } = state;
  const [topology, setTopologyType] = useState<TopologyType | null>('PHYSICAL_TOPOLOGY');

  const handleRefreshCoordinates = async () => {
    if (topology === null) {
      return;
    }
    dispatch(refreshCoordinates(client, topologyLayer, topology));
  };

  return (
    <Container maxWidth={1280} cursor={mode === 'NORMAL' ? 'default' : 'not-allowed'}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Device topology
        </Heading>
      </Flex>
      <Flex gridGap={4}>
        <FormControl width="sm" paddingBottom="24px">
          <FormLabel marginBottom={4}>Select layer:</FormLabel>
          <Select
            background="white"
            value={topologyLayer}
            onChange={(event) => {
              const selectedLayer = event.target.value as TopologyLayer;
              dispatch(setTopologyLayer(selectedLayer));
              setTopologyType(getTopologyType(selectedLayer));
            }}
          >
            {['LLDP', 'BGP-LS', 'PTP', 'MPLS', 'Synchronous Ethernet', 'Map'].map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
        {topologyLayer !== 'Map' && (
          <Box flex={1}>
            <VersionSelect />
          </Box>
        )}
        {topologyLayer === 'Map' && (
          <>
            <Box flex={1}>
              <TopologyTypeSelect />
            </Box>
            <DeviceSearch />
          </>
        )}
        {topologyLayer === 'LLDP' && (
          <Box flex={1}>
            <LabelsFilter />
          </Box>
        )}
        {topologyLayer === 'PTP' && (
          <FormControl flex={1}>
            <FormLabel htmlFor="email-alerts" mb="0">
              Show PTP Diff Synce
            </FormLabel>
            <Switch
              isChecked={isSynceDiffVisible}
              onChange={() => {
                if (isSynceDiffVisible) {
                  dispatch(setSelectedVersion(null));
                }

                dispatch(setSynceDiffVisibility(!isSynceDiffVisible));
              }}
              size="lg"
              pb="32px"
            />
          </FormControl>
        )}
      </Flex>
      <Box>
        {topologyLayer === 'LLDP' && <TopologyContainer />}
        {topologyLayer === 'BGP-LS' && <NetTopologyContainer />}
        {topologyLayer === 'PTP' && <PtpTopologyContainer isPtpDiffSynceShown={isSynceDiffVisible} />}
        {topologyLayer === 'Synchronous Ethernet' && <SynceTopologyContainer />}
        {topologyLayer === 'MPLS' && <MplsTopologyContainer />}
        {topologyLayer === 'Map' && <MapTopologyContainer />}
      </Box>
      {topology !== null && (
        <Flex justifyContent="flex-end" mt={4}>
          <Button
            onClick={handleRefreshCoordinates}
            data-cy="refresh-graph-button"
            colorScheme="blue"
            type="button"
            variant="outline"
            leftIcon={<RepeatIcon />}
          >
            Refresh graph
          </Button>
        </Flex>
      )}
    </Container>
  );
};

export default Topology;
