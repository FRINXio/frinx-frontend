import { Table, Thead, Tr, Th, Tbody, Td, Button, Tooltip, HStack, useDisclosure } from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared/src';
import React, { FC, useState } from 'react';
import AlternativeIdModal from '../../components/alternative-id-modal';
import Pagination from '../../components/pagination';
import { PaginationArgs } from '../../hooks/use-pagination';
import { AllocatedResourcesQuery } from '../../__generated__/graphql';

type AllocatedResources = AllocatedResourcesQuery['QueryResourcesByAltId'];
type AllocatedResource = NonNullable<AllocatedResources['edges'][0]>['node'];

type Props = {
  allocatedResources?: AllocatedResources;
  paginationArgs: PaginationArgs;
  onFreeResource: (userInput: Record<string, string | number>) => void;
  onPrevious: (cursor: string | null) => () => void;
  onNext: (cursor: string | null) => () => void;
};

const getNamesOfAllocatedResources = (allocatedResources?: AllocatedResources) => {
  if (allocatedResources == null) return [];

  return [
    ...new Set(
      allocatedResources.edges.reduce(
        (prev, curr) => {
          return prev.concat(
            Object.keys({
              ...curr?.node.Properties,
            }),
          );
        },
        [''],
      ),
    ),
  ].filter(omitNullValue);
};

const PoolDetailAllocatingTable: FC<Props> = ({
  allocatedResources,
  onFreeResource,
  onPrevious,
  onNext,
  paginationArgs,
}) => {
  const [selectedResource, setSelectedResource] = useState<AllocatedResource | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources);

  return (
    <>
      {selectedResource != null && (
        <AlternativeIdModal isOpen={isOpen} onClose={onClose} altIds={selectedResource.AlternativeId} />
      )}
      <Table background="white" size="sm">
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
            allocatedResources.edges.map((node) => {
              const resource = node?.node;
              const canDeallocateResource = node?.node.NestedPool != null;

              return resource != null ? (
                <Tr key={resource.id}>
                  {allocatedResourcesKeys.map((key) =>
                    key ? <Td key={`${key}-${resource.id}`}>{resource.Properties[key]}</Td> : null,
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
              ) : (
                <Tr>
                  <Td>There is no record</Td>
                </Tr>
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
          after={paginationArgs.after}
          before={paginationArgs.before}
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
