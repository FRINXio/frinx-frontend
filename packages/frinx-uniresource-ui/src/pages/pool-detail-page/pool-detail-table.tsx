import { Table, Thead, Tr, Th, Tbody, Td, Icon, IconButton, ButtonGroup } from '@chakra-ui/react';
import React, { FC } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Maybe, ResourceConnection, ResourceEdge } from '../../__generated__/graphql';

type Props = {
  allocatedResources: Maybe<ResourceConnection>;
  canFreeResource: boolean;
  onFreeResource: (userInput: Record<string, string | number>) => void;
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

const PoolDetailTable: FC<Props> = ({ allocatedResources, onFreeResource, canFreeResource }) => {
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources?.edges);

  return (
    <Table background="white">
      <Thead>
        <Tr>
          <Th>description</Th>
          {allocatedResourcesKeys.map((key) => (
            <Th key={key}>{key}</Th>
          ))}
          <Th>action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {allocatedResources != null && allocatedResources.edges.length > 0 ? (
          allocatedResources.edges.map((resource) => (
            <Tr key={resource?.node.id}>
              <Td>{resource?.node.Description}</Td>
              {allocatedResourcesKeys.map((key) => (
                <>
                  <Td key={resource?.node.Properties[key]}>{resource?.node.Properties[key]}</Td>
                </>
              ))}
              <Td>
                <ButtonGroup>
                  <IconButton
                    isDisabled={canFreeResource}
                    variant="outline"
                    colorScheme="red"
                    aria-label="delete"
                    icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                    onClick={() => onFreeResource({ ...resource?.node.Properties })}
                  />
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

export default PoolDetailTable;
