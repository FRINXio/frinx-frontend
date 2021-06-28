import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'urql';
import gql from 'graphql-tag';
import { Box, Button, Flex, Heading, Spinner, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import {
  DeletePoolMutation,
  DeletePoolMutationMutationVariables,
  QueryAllPoolsQuery,
} from '../../__generated__/graphql';
import PoolsTable from './pools-table';

const POOLS_QUERY = gql`
  query QueryAllPools {
    QueryResourcePools {
      id
      Name
      PoolType
      Tags {
        id
        Tag
      }
      AllocationStrategy {
        id
        Name
        Lang
      }
      ResourceType {
        id
        Name
      }
      Capacity {
        freeCapacity
        utilizedCapacity
      }
    }
  }
`;
const DELETE_POOL_MUTATION = gql`
  mutation DeletePool($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

type Props = {
  onNewPoolBtnClick: () => void;
};

const PoolsPage: FunctionComponent<Props> = ({ onNewPoolBtnClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching, error }] = useQuery<QueryAllPoolsQuery>({
    query: POOLS_QUERY,
    context,
  });
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);

  const handleDeleteBtnClick = useCallback(
    (id: string) => {
      deletePool({ input: { resourcePoolId: id } }, { additionalTypenames: ['ResourcePool'] });
    },
    [deletePool],
  );

  if (fetching) {
    return <Spinner size="xl" />;
  }

  if (data == null) {
    return null;
  }

  if (error != null) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Pools
        </Heading>
        <Box marginLeft="auto">
          <Button icon={<Icon size={20} as={FeatherIcon} icon="plus" />} colorScheme="blue" onClick={onNewPoolBtnClick}>
            Create Pool
          </Button>
        </Box>
      </Flex>
      <PoolsTable pools={data?.QueryResourcePools} onDeleteBtnClick={handleDeleteBtnClick} />
    </>
  );
};

export default PoolsPage;
