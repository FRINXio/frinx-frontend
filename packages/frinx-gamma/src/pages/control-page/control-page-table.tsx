import { Button, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';

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
type Props = {
  countState: TotalCountState;
  totalCount: CountState;
  isDiffLoading: boolean;
};

const ControlPageTable: VoidFunctionComponent<Props> = ({ countState, totalCount, isDiffLoading }) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th />
          <Th textAlign="right">Total</Th>
          <Th textAlign="right">Added</Th>
          <Th textAlign="right">Updated</Th>
          <Th textAlign="right">Deleted</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <Button variant="link" as={Link} to="../services">
              Services
            </Button>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {totalCount.services}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.added?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.updated?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.deleted?.services ?? '-'}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button variant="link" as={Link} to="../sites">
              Sites
            </Button>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {totalCount.sites}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.added?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.updated?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.deleted?.sites ?? '-'}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button variant="link" as={Link} to="../vpn-bearers">
              VPN Bearers
            </Button>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {totalCount.bearers}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.added?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.updated?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {isDiffLoading ? <Spinner size="xs" /> : countState.deleted?.bearers ?? '-'}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default ControlPageTable;
