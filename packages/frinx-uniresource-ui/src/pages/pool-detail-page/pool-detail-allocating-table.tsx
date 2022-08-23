import { Table, Thead, Tr, Th, Tbody, Td, Button, Tooltip, HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import Pagination from '../../components/pagination';
import { PaginationArgs } from '../../hooks/use-pagination';
import { AllocatedResourcesQuery } from '../../__generated__/graphql';

type Props = {
  allocatedResources?: AllocatedResourcesQuery['QueryResources'];
  paginationArgs: PaginationArgs;
  onFreeResource: (userInput: Record<string, string | number>) => void;
  onPrevious: (cursor: string | null) => () => void;
  onNext: (cursor: string | null) => () => void;
};

const getNamesOfAllocatedResources = (allocatedResources?: AllocatedResourcesQuery['QueryResources']) => {
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
  ];
};

const getAltIdsOfAllocatedResources = (allocatedResources?: AllocatedResourcesQuery['QueryResources']) => {
  if (allocatedResources == null) return [];

  return [
    ...new Set(
      allocatedResources.edges.reduce(
        (prev, curr) => {
          return prev.concat(
            Object.keys({
              ...curr?.node.AlternativeId,
            }),
          );
        },
        [''],
      ),
    ),
  ];
};

const PoolDetailAllocatingTable: FC<Props> = ({
  allocatedResources,
  onFreeResource,
  onPrevious,
  onNext,
  paginationArgs,
}) => {
  const allocatedResourcesKeys = getNamesOfAllocatedResources(allocatedResources);
  const allocatedResourcesAltIds = getAltIdsOfAllocatedResources(allocatedResources);

  return (
    <>
      <Table background="white" size="sm">
        <Thead bgColor="gray.200">
          <Tr>
            {allocatedResourcesKeys.map((key) => (key ? <Th key={key}>{key}</Th> : null))}
            <Th>description</Th>
            {allocatedResourcesAltIds.map((altId) => (altId ? <Th key={altId}>{altId}</Th> : null))}
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
                  {allocatedResourcesAltIds.map((altId) =>
                    altId ? <Td key={`${altId}-${resource.id}`}>{resource.AlternativeId[altId]}</Td> : null,
                  )}
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
