import {
  Box,
  Button,
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
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { getLocalDateFromUTC } from '../../helpers/time.helpers';
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

type Props = {
  onAddButtonClick: () => void;
};

const DeviceBlueprints: VoidFunctionComponent<Props> = ({ onAddButtonClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Blueprint'] }), []);

  const [{ data, fetching, error }] = useQuery<BlueprintsQuery, BlueprintsQueryVariables>({
    query: BLUEPRINTS_QUERY,
    context,
  });

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
        <Button colorScheme="blue" onClick={onAddButtonClick}>
          Add blueprint
        </Button>
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
            const localDate = getLocalDateFromUTC(blueprint.createdAt);

            return (
              <Tr key={blueprint.id}>
                <Td>
                  <Text as="span" fontWeight={600}>
                    {blueprint.name}
                  </Text>
                </Td>
                <Td>
                  <Tooltip label={format(localDate, 'dd/MM/yyyy, k:mm')}>
                    <Text as="span" fontSize="sm" color="blackAlpha.700">
                      {formatDistanceToNow(localDate)} ago
                    </Text>
                  </Tooltip>
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
