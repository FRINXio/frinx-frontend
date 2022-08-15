import { DeleteIcon } from '@chakra-ui/icons';
import { Table, Thead, Tr, Th, Tbody, Td, HStack, IconButton } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { ResourceTypesQuery } from '../../__generated__/graphql';

type Props = {
  resourceTypes: ResourceTypesQuery['QueryResourceTypes'];
  onDelete: (id: string) => void;
};

const ResourceTypesTable: VoidFunctionComponent<Props> = ({ resourceTypes, onDelete }) => {
  return (
    <Table backgroundColor="white" size="sm">
      <Thead bgColor="gray.200">
        <Tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {resourceTypes.map((resourceType) => (
          <Tr key={resourceType.id}>
            <Td>{resourceType.id}</Td>
            <Td>{resourceType.Name}</Td>
            <Td>
              <HStack>
                <IconButton
                  size="xs"
                  variant="outline"
                  colorScheme="red"
                  aria-label="delete"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    onDelete(resourceType.id);
                  }}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ResourceTypesTable;
