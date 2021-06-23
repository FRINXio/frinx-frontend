import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Resource, ResourcePool } from '../__generated__/graphql';

type NestedPoolProps = {
  pool: Pick<ResourcePool, 'id' | 'Name' | 'PoolType'> & { Resources: Pick<Resource, 'id' | 'Properties'>[] };
};

const NestedPool: FC<NestedPoolProps> = ({ pool }) => {
  const { id, Name, Resources } = pool;

  return (
    <div>
      {Name} : {id}
      {Resources?.map((resource) => (
        <Box key={resource.id} marginLeft={15}>
          {resource.id}
        </Box>
      ))}
    </div>
  );
};

export default NestedPool;
