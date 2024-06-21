import { Table, Thead, Tr, Th, Tbody, Td, Button, Tooltip, HStack, useDisclosure } from '@chakra-ui/react';
import { Pagination } from '@frinx/shared';
import React, { FC, useState } from 'react';
import AlternativeIdModal from '../../components/alternative-id-modal/alternative-id-modal';
import { AllocatedResourcesQuery } from '../../__generated__/graphql';

type AllocatedResources = AllocatedResourcesQuery['resourceManager']['QueryResourcesByAltId'];
type AllocatedResource = NonNullable<AllocatedResources['edges'][0]>['node'];

type Props = {
  allocatedResources?: AllocatedResources;
  onFreeResource: (userInput: Record<string, string | number>) => void;
  onPrevious: (cursor: string | null) => () => void;
  onNext: (cursor: string | null) => () => void;
};

const getNamesOfAllocatedResources = (allocatedResources?: AllocatedResources) => {
  if (allocatedResources == null) return [];

  const uniqueResourceNames = allocatedResources.edges.reduce<string[]>((prev, curr) => {
    const resourceNames = Object.keys(curr?.node.Properties);

    const updatedResource = [...new Set([...prev, ...resourceNames])];
    return updatedResource;
  }, []);

  return uniqueResourceNames;
};

const PoolDetailAllocatingTable: FC<Props> = ({ allocatedResources, onFreeResource, onPrevious, onNext }) => {
  const [selectedResource, setSelectedResource] = useState<AllocatedResource | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources);

  return (
    <>
      {selectedResource != null && (
        <AlternativeIdModal isOpen={isOpen} onClose={onClose} altIds={selectedResource.AlternativeId} />
      )}
      <Table data-cy="pool-details-table" background="white" size="sm">
        <Thead bgColor="gray.200">
          <Tr>
            {allocatedResourcesKeys.map((key) => (
              <Th key={key}>{key}</Th>
            ))}
            <Th>description</Th>
            <Th>alternative ids</Th>
            <Th>action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allocatedResources != null && allocatedResources.edges != null && allocatedResources.edges.length > 0 ? (
            allocatedResources.edges
              .filter((edge) => edge !== null)
              .map((node) => {
                const resource = node?.node;
                const canDeallocateResource = node?.node.NestedPool != null;

                return (
                  resource != null && (
                    <Tr key={resource.id}>
                      {allocatedResourcesKeys.map((key) =>
                        key ? <Td key={`${key}-${resource.id}`}>{resource.Properties[key].toString()}</Td> : null,
                      )}
                      <Td>{resource.Description}</Td>
                      <Td>
                        <Button
                          onClick={() => {
                            setSelectedResource(resource);
                            onOpen();
                          }}
                          size="xs"
                        >
                          Show alternative ids
                        </Button>
                      </Td>
                      <Td>
                        <HStack>
                          <Tooltip
                            label="Firstly you need to delete nested pools attached to this resource"
                            shouldWrapChildren
                            isDisabled={!canDeallocateResource}
                          >
                            <Button
                              isDisabled={canDeallocateResource}
                              onClick={() => onFreeResource(resource.Properties)}
                              size="xs"
                            >
                              Deallocate resource
                            </Button>
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  )
                );
              })
          ) : (
            <Tr>
              <Td>There are no allocated resources yet.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {allocatedResources != null && (
        <Pagination
          onPrevious={onPrevious(String(allocatedResources.pageInfo.startCursor))}
          onNext={onNext(String(allocatedResources.pageInfo.endCursor))}
          hasNextPage={allocatedResources.pageInfo.hasNextPage}
          hasPreviousPage={allocatedResources.pageInfo.hasPreviousPage}
        />
      )}
    </>
  );
};

export default PoolDetailAllocatingTable;
