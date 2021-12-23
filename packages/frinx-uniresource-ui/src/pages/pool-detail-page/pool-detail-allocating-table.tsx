import { Table, Thead, Tr, Th, Tbody, Td, ButtonGroup, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AllocatedResourcesQuery } from '../../__generated__/graphql';

type Props = {
  allocatedResources: AllocatedResourcesQuery;
  canFreeResource: boolean;
  onFreeResource: (userInput: Record<string, string | number>) => void;
};

const getNamesOfAllocatedResources = (allocatedResources: AllocatedResourcesQuery) => {
  if (allocatedResources == null) return [];

  return [
    ...new Set(
      allocatedResources.QueryResources.reduce(
        (prev, curr) => {
          return prev.concat(Object.keys(curr.Properties));
        },
        [''],
      ),
    ),
  ];
};

const PoolDetailAllocatingTable: FC<Props> = ({ allocatedResources, onFreeResource, canFreeResource }) => {
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources);

  return (
    <Table background="white">
      <Thead>
        <Tr>
          {allocatedResourcesKeys.map((key) => (
            <Th key={key}>{key}</Th>
          ))}
          <Th>action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allocatedResources != null && allocatedResources.QueryResources.length > 0 ? (
          allocatedResources.QueryResources.map((resource) => (
            <Tr key={resource.id}>
              {allocatedResourcesKeys.map((key) => (
                <Td key={`${key}-${resource.id}`}>{resource.Properties[key]}</Td>
              ))}
              <Td>
                <ButtonGroup>
                  <Button isDisabled={!canFreeResource} onClick={() => onFreeResource(resource.Properties)}>
                    Free
                  </Button>
                </ButtonGroup>
              </Td>
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

export default PoolDetailAllocatingTable;
