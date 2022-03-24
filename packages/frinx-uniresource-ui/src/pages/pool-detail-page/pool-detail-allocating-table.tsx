import { Table, Thead, Tr, Th, Tbody, Td, ButtonGroup, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AllocatedResourcesQuery } from '../../__generated__/graphql';

type Props = {
  allocatedResources: AllocatedResourcesQuery['QueryResources'];
  canFreeResource: boolean;
  onFreeResource: (userInput: Record<string, string | number>) => void;
};

const getNamesOfAllocatedResources = (allocatedResources: AllocatedResourcesQuery['QueryResources']) => {
  if (allocatedResources == null) return [];

  return [
    ...new Set(
      allocatedResources.reduce(
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
          {allocatedResourcesKeys.map((key) => (key ? <Th key={key}>{key}</Th> : null))}
          <Th>action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allocatedResources != null && allocatedResources.length > 0 ? (
          allocatedResources.map((resource) => (
            <Tr key={resource.id} title={resource.Description ?? ''}>
              {allocatedResourcesKeys.map((key) =>
                key ? <Td key={`${key}-${resource.id}`}>{resource.Properties[key]}</Td> : null,
              )}
              <Td>
                <ButtonGroup>
                  <Button isDisabled={!canFreeResource} onClick={() => onFreeResource(resource.Properties)}>
                    Deallocate
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
