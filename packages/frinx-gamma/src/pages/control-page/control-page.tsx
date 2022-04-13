import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import useCalcDiffContext from '../../providers/calcdiff-provider/use-calcdiff-context';
import unistoreCallbackUtils from '../../unistore-callback-utils';
import ControlPageTable from './control-page-table';

type CountState = {
  services: number;
  sites: number;
  bearers: number;
};
type TotalCountState = {
  added: CountState | null;
  updated: CountState | null;
  deleted: CountState | null;
};
const DEFAULT_UNCOMMITED_CHANGES: TotalCountState = {
  added: null,
  updated: null,
  deleted: null,
};
const DEFAULT_TOTAL_COUNT: CountState = {
  services: 0,
  sites: 0,
  bearers: 0,
};

function makeTotalCountState(payload: CalcDiffPayload | null): TotalCountState {
  if (payload != null) {
    const { changes } = payload;
    return {
      added: {
        services: Object.keys(changes.creates['vpn-services']).length,
        bearers: 0,
        sites: Object.keys(changes.creates.sites).length,
      },
      updated: {
        services: Object.keys(changes.updates['vpn-services']).length,
        bearers: 0,
        sites: Object.keys(changes.updates.sites).length,
      },
      deleted: {
        services: changes.deletes.vpn_service.length,
        bearers: 0,
        sites: changes.deletes.site.length,
      },
    };
  }
  return DEFAULT_UNCOMMITED_CHANGES;
}

const ControlPage: VoidFunctionComponent = () => {
  const { data, isLoading, isValid } = useCalcDiffContext();
  const [countState, setCountState] = useState(() => makeTotalCountState(data?.service ?? null));
  const [totalCount, setTotalCount] = useState<CountState>(DEFAULT_TOTAL_COUNT);

  useEffect(() => {
    (async () => {
      const callbacks = unistoreCallbackUtils.getCallbacks;
      const [serviceCount, siteCount, bearerCount] = await Promise.all([
        callbacks.getVpnServiceCount(null),
        callbacks.getVpnSiteCount(null),
        callbacks.getVpnBearerCount(null),
      ]);
      setTotalCount({ services: serviceCount, sites: siteCount, bearers: bearerCount });
    })();
  }, [isValid]);

  useEffect(() => {
    if (data != null) {
      setCountState(makeTotalCountState(data.service));
    }
  }, [data]);

  return (
    <Container maxWidth={1280} minHeight="60vh">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="lg">
          Control page
        </Heading>
      </Flex>
      <Box>
        <ControlPageTable countState={countState} totalCount={totalCount} isDiffLoading={isLoading} />
      </Box>
    </Container>
  );
};

export default ControlPage;
