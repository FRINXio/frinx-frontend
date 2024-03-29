import { Box, HStack, Heading, Spacer, Button } from '@chakra-ui/react';
import { omitNullValue } from '@frinx/shared';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { DeleteResourcePoolOptions } from '../../hooks/use-resource-pool-actions';
import { GetPoolDetailQuery } from '../../__generated__/graphql';
import PoolsTable from '../pools-page/pools-table';

type Props = {
  poolId: string;
  resourcePool: GetPoolDetailQuery['resourceManager']['QueryResourcePool'];
  isLoadingPool: boolean;
  deleteResourcePool: (id: string, options?: DeleteResourcePoolOptions | undefined) => void;
};

const PoolDetailNestedPoolsTable: VoidFunctionComponent<Props> = ({
  isLoadingPool,
  deleteResourcePool,
  resourcePool,
  poolId,
}) => {
  const nestedPools = resourcePool.Resources.map((resource) =>
    resource.NestedPool !== null ? resource.NestedPool : null,
  ).filter(omitNullValue);

  const isPrefixOrRange =
    resourcePool.ResourceType.Name === 'ipv4_prefix' ||
    resourcePool.ResourceType.Name === 'ipv6_prefix' ||
    resourcePool.ResourceType.Name === 'vlan_range' ||
    resourcePool.ResourceType.Name === 'route_distinguisher';
  const canCreateNestedPool = resourcePool.Resources.some((resource) => resource.NestedPool == null) && isPrefixOrRange;

  return isPrefixOrRange ? (
    <Box my={10}>
      <HStack mb={5}>
        <Heading size="md">Nested Pools</Heading>
        <Spacer />
        {canCreateNestedPool && (
          <Button colorScheme="blue" as={Link} to={`../pools/new?parentPoolId=${poolId}&isNested=true`}>
            Create nested pool
          </Button>
        )}
      </HStack>
      <PoolsTable pools={nestedPools} isLoading={isLoadingPool} onDeleteBtnClick={deleteResourcePool} />
    </Box>
  ) : (
    <Box textAlign="center">This pool cannot have nested pools</Box>
  );
};

export default PoolDetailNestedPoolsTable;
