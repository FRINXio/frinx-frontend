import { InfoIcon } from '@chakra-ui/icons';
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
          return prev.concat(Object.keys(curr?.node.Properties));
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
  return (
    <>
      <Table background="white" size="sm">
        <Thead>
          <Tr>
            {allocatedResourcesKeys.map((key) => (key ? <Th key={key}>{key}</Th> : null))}
            <Th>description</Th>
            <Th>action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allocatedResources != null && allocatedResources.edges != null && allocatedResources.edges.length > 0 ? (
            allocatedResources.edges.map((node) => {
              const resource = node?.node;
              const canDeallocatedResource = node?.node.NestedPool != null;

              return resource != null ? (
                <Tr key={resource.id}>
                  {allocatedResourcesKeys.map((key) =>
                    key ? <Td key={`${key}-${resource.id}`}>{resource.Properties[key]}</Td> : null,
                  )}
                  <Td>{resource.Description}</Td>
                  <Td>
                    <HStack>
                      <Button
                        title="Deallocate resource"
                        isDisabled={canDeallocatedResource}
                        onClick={() => onFreeResource(resource.Properties)}
                        size="xs"
                      >
                        Deallocate
                      </Button>
                      {canDeallocatedResource && (
                        <Tooltip label="To deallocated resource, firstly you need to delete nested pools of this resource">
                          <InfoIcon />
                        </Tooltip>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ) : (
                <Tr>There is no record</Tr>
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
