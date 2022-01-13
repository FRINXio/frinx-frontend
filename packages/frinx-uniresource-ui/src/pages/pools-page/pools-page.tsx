import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'urql';
import gql from 'graphql-tag';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
  Progress,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
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
  onNewIpv4PrefixBtnClick: () => void;
  onNewVlanBtnClick: () => void;
  onPoolNameClick: (poolId: string) => void;
};

const PoolsPage: FunctionComponent<Props> = ({
  onNewPoolBtnClick,
  onNewIpv4PrefixBtnClick,
  onNewVlanBtnClick,
  onPoolNameClick,
}) => {
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

  const { isOpen, onToggle } = useDisclosure();

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
          <Button
            mr={2}
            icon={<Icon size={20} as={FeatherIcon} icon="plus" />}
            colorScheme="blue"
            onClick={onNewPoolBtnClick}
          >
            Create Pool
          </Button>
          <Menu colorScheme="blue">
            <MenuButton
              rounded="lg"
              fontSize="small"
              // textColor="gray"
              as={IconButton}
              aria-label="Options"
              icon={isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}
              onClick={onToggle}
            />
            <MenuList>
              <MenuItem as={Link} onClick={onNewIpv4PrefixBtnClick}>
                IPv4 prefix pool
              </MenuItem>
              <MenuItem as={Link} onClick={onNewVlanBtnClick}>
                Vlan pool
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Box position="relative">
        <Box position="absolute" top={0} left={0} right={0}>
          {fetching && <Progress isIndeterminate size="xs" />}
        </Box>
        <PoolsTable
          pools={data?.QueryResourcePools || null}
          isLoading={fetching}
          onDeleteBtnClick={handleDeleteBtnClick}
          onPoolNameClick={onPoolNameClick}
        />
      </Box>
    </>
  );
};

export default PoolsPage;
