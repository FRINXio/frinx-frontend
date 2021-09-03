import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { gql, useQuery } from 'urql';
import FeatherIcon from 'feather-icons-react';
import { BlueprintsQuery, BlueprintsQueryVariables } from '../../__generated__/graphql';

const BLUEPRINTS_QUERY = gql`
  query Blueprints {
    blueprints {
      edges {
        node {
          id
          createdAt
          name
        }
      }
    }
  }
`;

const DeviceBlueprints: VoidFunctionComponent = () => {
  const [{ data, fetching, error }] = useQuery<BlueprintsQuery, BlueprintsQueryVariables>({ query: BLUEPRINTS_QUERY });

  if (fetching || data == null) {
    return null;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const { blueprints } = data;

  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Device blueprints
        </Heading>
      </Flex>
      <Box position="relative">
        {fetching && data != null && (
          <Box position="absolute" top={0} right={0} left={0}>
            <Progress size="xs" isIndeterminate />
          </Box>
        )}
      </Box>
      <Table background="white" size="lg">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {blueprints.edges.map(({ node: blueprint }) => {
            return (
              <Tr key={blueprint.id}>
                <Td>
                  <Text as="span" fontWeight={600}>
                    {blueprint.name}
                  </Text>
                </Td>
                <Td>
                  {format(
                    utcToZonedTime(blueprint.createdAt, Intl.DateTimeFormat().resolvedOptions().timeZone),
                    'dd/mm/yyyy, k:m',
                  )}
                </Td>
                <Td>
                  <IconButton
                    colorScheme="red"
                    size="sm"
                    aria-label="Delete blueprint"
                    icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default DeviceBlueprints;
