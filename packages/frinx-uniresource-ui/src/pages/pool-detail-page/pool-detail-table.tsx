import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Maybe, ResourceConnection, ResourceEdge } from '../../__generated__/graphql';

type Props = {
  allocatedResources: Maybe<ResourceConnection>;
};

const getNamesOfAllocatedResources = (allocatedResources: Maybe<ResourceEdge>[] | undefined) => {
  if (allocatedResources == null) return [];

  return [
    ...new Set(
      allocatedResources.reduce(
        (prev, curr) => {
          return prev.concat(Object.keys(curr?.node.Properties));
        },
        [''],
      ),
    ),
  ];
};

const PoolDetailTable: FC<Props> = ({ allocatedResources }) => {
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources?.edges);
  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th>description</Th>
          {allocatedResourcesKeys.map((key) => (
            <Th key={key}>{key}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {allocatedResources != null && allocatedResources.edges.length > 0 ? (
          allocatedResources.edges.map((resource) => (
            <Tr key={resource?.node.id}>
              <Td>{resource?.node.Description}</Td>
              {allocatedResourcesKeys.map((key) => (
                <Td key={resource?.node.Properties[key]}>{resource?.node.Properties[key]}</Td>
              ))}
            </Tr>
          ))
        ) : (
          <Tr>
            <Td>There are no allocated resources yet.</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default PoolDetailTable;
