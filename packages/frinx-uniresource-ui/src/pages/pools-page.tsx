import React, { FunctionComponent } from 'react';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { Box, Button, Flex, Heading, Spinner } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { QueryAllPoolsQuery } from '../__generated__/graphql';
import PoolsTable from '../components/pools-table';

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

type Props = {
  onNewPoolBtnClick: () => void;
};

const PoolsList: FunctionComponent<Props> = ({ onNewPoolBtnClick }) => {
  const [{ data, fetching, error }] = useQuery<QueryAllPoolsQuery>({
    query: POOLS_QUERY,
  });

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
          <Button leftIcon={<SmallAddIcon />} colorScheme="blue" onClick={onNewPoolBtnClick}>
            Create pool
          </Button>
        </Box>
      </Flex>
      <PoolsTable pools={data?.QueryResourcePools} />
    </>
  );
};

export default PoolsList;
