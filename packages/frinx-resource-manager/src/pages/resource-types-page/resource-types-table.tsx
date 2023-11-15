import { Table, Thead, Tr, Th, Tbody, Td, HStack, IconButton, Icon } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { ResourceTypesQuery } from '../../__generated__/graphql';
import DeleteModal from '../../components/delete-modal';

type Props = {
  resourceTypes: ResourceTypesQuery['resourceManager']['QueryResourceTypes'];
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
                <DeleteModal
                  type="resource type"
                  onDelete={() => onDelete(resourceType.id)}
                  entityName={resourceType.Name}
                >
                  <IconButton
                    data-cy={`delete-type-${resourceType.Name}`}
                    size="xs"
                    variant="outline"
                    colorScheme="red"
                    aria-label="delete"
                    icon={<Icon as={FeatherIcon} icon="trash-2" />}
                  />
                </DeleteModal>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ResourceTypesTable;
