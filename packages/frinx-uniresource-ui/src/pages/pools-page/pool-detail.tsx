import { Flex, Grid, List, ListItem, Text } from '@chakra-ui/react';
import React, { FC, VoidFunctionComponent } from 'react';
import { omitMaybeType } from '../../helpers/omit-null-value';
import { GetAllPoolsQuery } from '../../__generated__/graphql';

type ItemProps = {
  label: string;
  value?: string | number | null;
};

const DetailItem: FC<ItemProps> = ({ label, value, children }) => {
  return (
    <Flex>
      <Text mr={4} fontWeight="bold">
        {label}:
      </Text>
      {children || <Text>{value}</Text>}
    </Flex>
  );
};

const NestedPools: VoidFunctionComponent<{
  items: GetAllPoolsQuery['QueryResourcePools'][0];
  onNestedPoolClick: (poolId: string) => void;
}> = ({ items, onNestedPoolClick }) => {
  const pools = items.Resources.map(({ NestedPool }) =>
    NestedPool != null ? (
      <ListItem mr={2} key={NestedPool.id} onClick={() => onNestedPoolClick(NestedPool.id)} cursor="pointer">
        {NestedPool?.Name}
      </ListItem>
    ) : null,
  ).filter(Boolean);

  return (
    <DetailItem label="Nested pools">{pools.length ? <List>{pools}</List> : <Text>has no subpools</Text>}</DetailItem>
  );
};

type DetailProps = {
  resourcePool: GetAllPoolsQuery['QueryResourcePools'][0];
  onPoolClick: (poolId: string) => void;
};

type Resources = GetAllPoolsQuery['QueryResourcePools'][0]['Resources'];

export const PoolDetail: VoidFunctionComponent<DetailProps> = ({ resourcePool, onPoolClick }) => {
  const getAvailableNestedPools = (resources: Resources) => {
    if (resources == null) {
      return 0;
    }
    return resources.filter((resource) => resource.NestedPool === null).length;
  };

  const getUsedNestedPools = (resources: Resources) => {
    if (resources == null) {
      return 0;
    }
    return resources.filter((resource) => resource.NestedPool !== null).length;
  };

  const totalCapacity = Number(resourcePool.Capacity?.freeCapacity) + Number(resourcePool.Capacity?.utilizedCapacity);
  const parentPool = omitMaybeType(resourcePool.ParentResource);

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <DetailItem label="Used subpools" value={getUsedNestedPools(resourcePool.Resources)} />
      <DetailItem label="Available subpools" value={getAvailableNestedPools(resourcePool.Resources)} />
      <DetailItem label="Used resources" value={resourcePool.Capacity?.utilizedCapacity} />
      <DetailItem label="Available resources" value={resourcePool.Capacity?.freeCapacity} />
      <DetailItem label="Total resources" value={totalCapacity} />
      <DetailItem label="Parent pool">
        {parentPool != null ? (
          <Text mr={2} onClick={() => onPoolClick(parentPool.ParentPool.id)} cursor="pointer">
            {parentPool.ParentPool.Name}
          </Text>
        ) : (
          <Text>has no parent pool</Text>
        )}
      </DetailItem>
      <NestedPools items={resourcePool} onNestedPoolClick={onPoolClick} />
      <DetailItem label="Pool properties" value={JSON.stringify(resourcePool.PoolProperties)} />
    </Grid>
  );
};
