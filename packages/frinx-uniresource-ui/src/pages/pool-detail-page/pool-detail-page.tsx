import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  ListItem,
  Progress,
  Spacer,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import PageContainer from '../../components/page-container';
import {
  ClaimResourceMutationMutation,
  ClaimResourceMutationMutationVariables,
  FreeResourceMutationMutation,
  FreeResourceMutationMutationVariables,
  QueryPoolDetailQuery,
  QueryPoolDetailQueryVariables,
} from '../../__generated__/graphql';

type Props = {
  poolId: string;
};

const POOL_DETAIL_QUERY = gql`
  query QueryPoolDetail($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      id
      Name
      PoolType
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
      Capacity {
        freeCapacity
        utilizedCapacity
      }
    }
  }
`;

const CLAIM_RESOURCES_MUTATION = gql`
  mutation ClaimResource($poolId: ID!, $description: String, $input: Map!) {
    ClaimResource(poolId: $poolId, description: $description, userInput: $input) {
      Description
      id
      Properties
    }
  }
`;

const FREE_RESOURCES_MUTATION = gql`
  mutation FreeResource($poolId: ID!, $input: Map!) {
    FreeResource(input: $input, poolId: $poolId)
  }
`;

const PoolDetailPage: FC<Props> = ({ poolId }) => {
  const [{ data, fetching: isLoadingPool }] = useQuery<QueryPoolDetailQuery, QueryPoolDetailQueryVariables>({
    query: POOL_DETAIL_QUERY,
    variables: {
      poolId,
    },
  });

  const [, claimResource] = useMutation<ClaimResourceMutationMutation, ClaimResourceMutationMutationVariables>(
    CLAIM_RESOURCES_MUTATION,
  );
  const [, freeResource] = useMutation<FreeResourceMutationMutation, FreeResourceMutationMutationVariables>(
    FREE_RESOURCES_MUTATION,
  );

  const claimPoolResource = (userInput: Map<string, string>, description?: string) => {
    claimResource({
      poolId,
      userInput,
      ...(description != null && { description }),
    });
  };

  const freePoolResource = (userInput: Map<string, string>) => {
    freeResource({
      poolId,
      input: userInput,
    });
  };

  if (isLoadingPool) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (data == null || data.QueryResourcePool == null) {
    return <Box textAlign="center">Resource pool does not exists</Box>;
  }

  const { QueryResourcePool: resourcePool } = data;
  const canClaimResources = resourcePool.Capacity != null && resourcePool.Capacity.freeCapacity > 0;
  const canFreeResources =
    resourcePool.Capacity != null && resourcePool.Capacity.freeCapacity !== resourcePool.Capacity.utilizedCapacity;

  return (
    <PageContainer>
      <Flex alignItems="center">
        <Heading size="3xl" as="h2" mb={6}>
          {resourcePool.Name}
        </Heading>
        <Spacer />
        <Box>
          <ButtonGroup spacing={6} variant="outline">
            <Button onClick={() => console.log('claimol som')} colorScheme="blue" isDisabled={canClaimResources}>
              Claim resources
            </Button>
            <Button onClick={() => console.log('freeol som')} colorScheme="red" isDisabled={canFreeResources}>
              Free resources
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>

      <HStack>
        <Text fontSize="xl">
          Capacity: {resourcePool.Capacity?.freeCapacity}/{resourcePool.Capacity?.utilizedCapacity}
        </Text>
      </HStack>

      <Box mt={10}>
        <Heading size="lg">Allocated Resources</Heading>
        <UnorderedList listStyleType="none">
          {resourcePool.allocatedResources != null &&
            resourcePool.allocatedResources.edges.map((resource) => (
              <ListItem key={resource?.node.Description}>
                <Box>
                  {resource?.node.Description}
                  <br />
                  {resource?.node.Properties.address}/{resource?.node.Properties.prefix}
                </Box>
              </ListItem>
            ))}
        </UnorderedList>
      </Box>
    </PageContainer>
  );
};

export default PoolDetailPage;
