import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';

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
type Props = {
  countState: TotalCountState;
};

const ControlPageTable: VoidFunctionComponent<Props> = ({ countState }) => {
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
            {countState.total?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.services ?? '-'}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button variant="link" as={Link} to="../sites">
              Sites
            </Button>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.total?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.sites ?? '-'}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button variant="link" as={Link} to="../vpn-bearers">
              VPN Bearers
            </Button>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.total?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.bearers ?? '-'}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default ControlPageTable;
