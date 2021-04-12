import { Box } from '@chakra-ui/react';
import React from 'react';
import { Resource, ResourcePool } from '../__generated__/graphql';

type NestedPoolProps = {
  pool: ResourcePool;
};

const NestedPool = ({ pool }: NestedPoolProps) => {
  const { id, Name, Resources } = pool;
  return (
    <div>
      {Name} : {id}
      {Resources?.map((resource: Resource) => (
        <Box key={resource.id} marginLeft={15}>
          {resource.NestedPool ? <NestedPool pool={resource.NestedPool} /> : null}
        </Box>
      ))}
    </div>
  );
};

export default NestedPool;
