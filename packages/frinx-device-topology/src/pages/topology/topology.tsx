import { Box, Container, Flex, FormControl, FormLabel, Heading, Select, Switch } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import LabelsFilter from '../../components/labels-filter/labels-filter';
import VersionSelect from '../../components/version-select/version-select';
import { setSelectedVersion, setSynceDiffVisibility, setTopologyLayer } from '../../state.actions';
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

const Topology: VoidFunctionComponent = () => {
  const { state, dispatch } = useStateContext();
  const { mode, topologyLayer, isSynceDiffVisible } = state;

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
              dispatch(setTopologyLayer(event.target.value as TopologyLayer));
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
    </Container>
  );
};

export default Topology;
