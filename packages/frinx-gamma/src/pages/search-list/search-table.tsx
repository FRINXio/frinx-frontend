import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React, { VoidFunctionComponent } from 'react';
import { TableItem } from './search-helper';
import SearchDetail from './search-detail';
import unwrap from '../../helpers/unwrap';

type Props = {
  size: 'sm' | 'md';
  detailId: string | null;
  rows: TableItem[];
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({ detailId, size, rows, onRowClick }) => {
  return (
    <Table background="white" size={size}>
      <Thead>
        <Tr>
          <Th />
          <Th>VPN ID</Th>
          <Th>Customer Name</Th>
          <Th>Site Id</Th>
          <Th>Site Network Access Id</Th>
          <Th>Bearer Reference</Th>
          <Th>Sp Bearer Reference</Th>
        </Tr>
      </Thead>
      {rows.map((row) => {
        const rowId = `${unwrap(row.vpnId)}-${row.siteNetworkAccessId}`;
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={`${row.vpnId}-${row.siteNetworkAccessId}`}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Text as="span">{row.vpnId}</Text>
              </Td>
              <Td>
                <Text as="span">{row.customerName}</Text>
              </Td>
              <Td>
                <Text as="span">{row.siteId}</Text>
              </Td>
              <Td>
                <Text as="span">{row.siteNetworkAccessId}</Text>
              </Td>
              <Td>
                <Text as="span">{row.bearerReference}</Text>
              </Td>
              <Td>
                <Text as="span">{row.spBearerReference}</Text>
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={6}>
                  <SearchDetail searchItem={row} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default ServiceTable;
