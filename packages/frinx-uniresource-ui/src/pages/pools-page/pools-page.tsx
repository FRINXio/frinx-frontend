import React, { FunctionComponent, useMemo } from 'react';
import { useMutation, useQuery } from 'urql';
import gql from 'graphql-tag';
import { Box, Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { DeletePoolMutation, DeletePoolMutationMutationVariables, GetAllPoolsQuery } from '../../__generated__/graphql';
import PoolsTable from './pools-table';
import useNotifications from '../../hooks/use-notifications';

const POOLS_QUERY = gql`
  query GetAllPools {
    QueryResourcePools {
      id
      Name
      PoolType
      Tags {
        id
        Tag
      }
      PoolProperties
      AllocationStrategy {
        id
        Name
        Lang
      }
      ResourceType {
        id
        Name
      }
      Resources {
        id
        NestedPool {
          id
          Name
        }
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
  onPoolNameClick: (poolId: string) => void;
  onRowClick: (poolId: string) => void;
};

const PoolsPage: FunctionComponent<Props> = ({ onNewPoolBtnClick, onPoolNameClick, onRowClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['ResourcePool'] }), []);
  const [{ data, fetching, error }] = useQuery<GetAllPoolsQuery>({
    query: POOLS_QUERY,
    context,
  });
  const [, deletePool] = useMutation<DeletePoolMutation, DeletePoolMutationMutationVariables>(DELETE_POOL_MUTATION);
  const { addToastNotification } = useNotifications();

  const handleDeleteBtnClick = async (id: string) => {
    try {
      const result = await deletePool({ input: { resourcePoolId: id } }, context);
      if (result.error) {
        throw Error();
      }
      addToastNotification({
        type: 'success',
        content: 'Successfully deleted resource pool',
      });
    } catch {
      addToastNotification({
        type: 'error',
        content: 'There was a problem with deletion of the resource pool',
      });
    }
  };

  if (error != null && data === null) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Pools
        </Heading>
        <Box marginLeft="auto">
          <Button
            mr={2}
            leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
            colorScheme="blue"
            onClick={onNewPoolBtnClick}
          >
            Create Pool
          </Button>
        </Box>
      </Flex>
      <Box position="relative" marginBottom={5}>
        <Box position="absolute" top={0} left={0} right={0}>
          {fetching && <Progress isIndeterminate size="xs" />}
        </Box>
        <PoolsTable
          pools={data?.QueryResourcePools}
          isLoading={fetching}
          onDeleteBtnClick={handleDeleteBtnClick}
          onPoolNameClick={onPoolNameClick}
          onRowClick={onRowClick}
        />
      </Box>
    </>
  );
};

export default PoolsPage;
