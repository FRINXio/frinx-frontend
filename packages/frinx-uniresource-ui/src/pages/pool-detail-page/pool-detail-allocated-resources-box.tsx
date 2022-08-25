import { Box, HStack, Heading, Spacer, Button, Progress, Text } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PaginationArgs } from '../../hooks/use-pagination';
import { AllocatedResourcesQuery, GetPoolDetailQuery } from '../../__generated__/graphql';
import AlternativeIdForm, { AlternativeId } from './claim-resource-modal/alternative-id-form';
import PoolDetailAllocatingTable from './pool-detail-allocating-table';
import PoolDetailSetSingletonTable from './pool-detail-set_singleton-table';

type Props = {
  isLoadingResources: boolean;
  resourcePool: GetPoolDetailQuery['QueryResourcePool'];
  allocatedResources?: AllocatedResourcesQuery;
  pagination: {
    nextPage: (cursor: string | null) => () => void;
    previousPage: (cursor: string | null) => () => void;
    paginationArgs: PaginationArgs;
  };
  handleAlternativeIdsChange: (altIdsObject: Record<string, string | string[]>) => void;
  claimPoolResource: (
    description?: string | null | undefined,
    userInput?: Record<string, string | number> | undefined,
  ) => void;
  freePoolResource: (userInput: Record<string, string | number>) => void;
};

function formatSearchParams(searchParams: URLSearchParams) {
  const keys = [...new Set(Array.from(searchParams.keys()))];

  return keys.map((key) => {
    return { key, value: searchParams.getAll(key) };
  });
}

const PoolDetailAllocatedResourceBox: VoidFunctionComponent<Props> = ({
  isLoadingResources,
  resourcePool,
  allocatedResources,
  handleAlternativeIdsChange,
  pagination,
  claimPoolResource,
  freePoolResource,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [altIds, setAltIds] = useState<AlternativeId[]>([]);

  useEffect(() => {
    setAltIds(formatSearchParams(searchParams));
  }, [isLoadingResources, searchParams]);

  const handleOnAlternativeIdsSubmit = () => {
    setSearchParams(
      altIds.reduce((prev, curr) => {
        if (Object.keys(prev).includes(curr.key)) {
          return { ...prev, [curr.key]: [...new Set(curr.value.concat(prev[curr.key]))] };
        }

        return { ...prev, [curr.key]: curr.value };
      }, Object.create({})),
    );

    handleAlternativeIdsChange(
      altIds.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.key]: curr.value.length === 1 ? curr.value.pop() : curr.value,
        };
      }, {}),
    );
  };

  return (
    <Box my={10}>
      <HStack my={5}>
        <Heading size="md">Allocated Resources</Heading>
        <Spacer />
        <Button onClick={handleOnAlternativeIdsSubmit} colorScheme="blue">
          Search by alternative id
        </Button>
      </HStack>
      {resourcePool.PoolType === 'allocating' && (
        <>
          <Box my={5}>
            {altIds.length === 0 && (
              <Text>
                By clicking at the <i>Add alternative id</i> button you can add alternative id by which you can filter
                allocated resources
              </Text>
            )}
            <AlternativeIdForm alternativeIds={altIds} onChange={setAltIds} />
          </Box>
          {isLoadingResources ? (
            <Progress isIndeterminate size="sm" />
          ) : (
            <PoolDetailAllocatingTable
              allocatedResources={allocatedResources?.QueryResourcesByAltId}
              onFreeResource={freePoolResource}
              onNext={pagination.nextPage}
              onPrevious={pagination.previousPage}
              paginationArgs={pagination.paginationArgs}
            />
          )}
        </>
      )}
      {(resourcePool.PoolType === 'set' || resourcePool.PoolType === 'singleton') && (
        <PoolDetailSetSingletonTable
          resources={resourcePool.Resources}
          allocatedResources={allocatedResources?.QueryResourcesByAltId}
          onFreeResource={freePoolResource}
          onClaimResource={claimPoolResource}
          onNext={pagination.nextPage}
          onPrevious={pagination.previousPage}
          paginationArgs={pagination.paginationArgs}
        />
      )}
    </Box>
  );
};

export default PoolDetailAllocatedResourceBox;
