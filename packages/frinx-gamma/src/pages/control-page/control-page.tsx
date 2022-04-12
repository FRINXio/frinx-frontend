import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import useCalcDiffContext from '../../providers/calcdiff-provider/user-calcdiff-context';
import ControlPageTable from './control-page-table';

type CountState = {
  services: number;
  sites: number;
  bearers: number;
};
type TotalCountState = {
  total: CountState | null;
  added: CountState | null;
  updated: CountState | null;
  deleted: CountState | null;
};
const DEFAULT_UNCOMMITED_CHANGES: TotalCountState = {
  total: null,
  added: null,
  updated: null,
  deleted: null,
};

function makeTotalCountState(countState: TotalCountState, payload: CalcDiffPayload | null): TotalCountState {
  if (payload != null) {
    const { changes } = payload;
    return {
      total: countState.total,
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
  const { data } = useCalcDiffContext();
  const countState = makeTotalCountState(DEFAULT_UNCOMMITED_CHANGES, data?.service ?? null);

  return (
    <Container maxWidth={1280} minHeight="60vh">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="lg">
          Control page
        </Heading>
      </Flex>
      <Box>
        <ControlPageTable
          countState={{
            ...countState,
            total: countState.total,
          }}
        />
      </Box>
    </Container>
  );
};

export default ControlPage;
