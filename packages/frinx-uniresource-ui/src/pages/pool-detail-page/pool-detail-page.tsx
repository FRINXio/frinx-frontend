import { Box, Heading, Progress } from '@chakra-ui/react';
import React, { FC } from 'react';
import { gql, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import { QueryPoolDetailQuery, QueryPoolDetailQueryVariables } from '../../__generated__/graphql';

type Props = {
  poolId: string;
};

const QueryPoolDetail = gql`
  query QueryPoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
      Resources {
        Description
        Properties
        id
      }
      allocatedResources {
        edges {
          node {
            Description
            Properties
          }
        }
        totalCount
      }
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

const PoolDetailPage: FC<Props> = ({ poolId }) => {
  const [{ data, fetching, error }] = useQuery<QueryPoolDetailQuery, QueryPoolDetailQueryVariables>({
    query: QueryPoolDetail,
    variables: {
      poolId,
    },
  });

  if (fetching) {
    return <Progress isIndeterminate mt={-10} />;
  }

  if (data == null || error != null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = data;

  return (
    <PageContainer>
      <Heading size="xl">{resourcePool.Name}</Heading>
    </PageContainer>
  );
};

export default PoolDetailPage;
