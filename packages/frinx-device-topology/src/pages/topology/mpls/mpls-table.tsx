import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { MplsData } from '../graph.helpers';

type Props = {
  data: MplsData[];
};

const MplsTable: VoidFunctionComponent<Props> = ({ data }) => {
  const tableColumns = new Map<keyof MplsData, string>([
    ['lspId', 'Lsp Id'],
    ['inputLabel', 'Input Label'],
    ['inputInterface', 'Input Interface'],
    ['outputLabel', 'Output Label'],
    ['outputInterface', 'Output Ingerface'],
    ['operState', 'Oper State'],
    ['mplsOperation', 'MPLS Operation'],
    ['ldpPrefix', 'Ldp Prefix'],
  ]);

  return (
    <TableContainer>
      <Table variant="simple" size="sm" minW={800}>
        <TableCaption>Mpls data</TableCaption>
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
              <Tr key={`mpls-data-row-${row.lspId}`}>
                {[...tableColumns.keys()].map((column) => (
                  <Td key={`mpls-data-row-${row.lspId}-column-${column}`}>{row[column] ?? '-'}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default MplsTable;
