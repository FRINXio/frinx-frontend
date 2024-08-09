import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { LspTunnel } from '../graph.helpers';

type Props = {
  data: LspTunnel[];
};

const LspTable: VoidFunctionComponent<Props> = ({ data }) => {
  const tableColumns = new Map<keyof LspTunnel, string>([
    ['lspId', 'Lsp Id'],
    ['fromDevice', 'From Device'],
    ['toDevice', 'To Device'],
    ['signalization', 'Signalization'],
    ['uptime', 'Uptime'],
  ]);

  return (
    <TableContainer>
      <Table variant="simple" size="sm" minW={800}>
        <TableCaption>Lsp Tunnels</TableCaption>
        <Thead>
          <Tr>
            {[...tableColumns.entries()].map(([key, header]) => (
              <Th key={key}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => {
            return (
              <Tr key={`lsp-tunnels-row-${row.lspId}`}>
                {[...tableColumns.keys()].map((column) => (
                  <Td key={`lsp-tunnels-row-${row.lspId}-column-${column}`}>{row[column] ?? '-'}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default LspTable;
