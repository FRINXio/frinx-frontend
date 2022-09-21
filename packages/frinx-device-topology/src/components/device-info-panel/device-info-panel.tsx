import { Badge, Box, Button, Flex, Heading, HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import FeatherIcon from 'feather-icons-react';
import { DeviceQuery, DeviceQueryVariables } from '../../__generated__/graphql';

export function getLocalDateFromUTC(date: string): Date {
  return utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
}

const DEVICE_QUERY = gql`
  query Device($id: ID!) {
    node(id: $id) {
      ... on Device {
        id
        name
        isInstalled
        createdAt
        serviceState
      }
    }
  }
`;

type Props = {
  deviceId: string;
  onClose: () => void;
};

const DeviceInfoPanel: VoidFunctionComponent<Props> = ({ deviceId, onClose }) => {
  const [{ data, fetching, error }] = useQuery<DeviceQuery, DeviceQueryVariables>({
    query: DEVICE_QUERY,
    variables: { id: deviceId },
  });

  if (fetching) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }
  if (error || data == null) {
    return null;
  }
  const { node } = data;

  if (node == null) {
    return null;
  }

  if (node.__typename !== 'Device') {
    return null;
  }

  const localDate = getLocalDateFromUTC(node.createdAt);

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3" size="sm">
          {node.name}
        </Heading>
        <Badge marginLeft="auto">{node.serviceState}</Badge>
      </Flex>
      <Text as="span" fontSize="xs" color="gray.700">
        {format(localDate, 'dd/MM/yyyy, k:mm')}
      </Text>
      <HStack spacing={2} marginTop={4}>
        <Button
          as={Link}
          to={`/inventory/${node.id}/edit`}
          size="sm"
          colorScheme="blue"
          leftIcon={<Icon as={FeatherIcon} icon="settings" size={20} />}
        >
          Config
        </Button>
        <Button size="sm" onClick={onClose}>
          Close
        </Button>
      </HStack>
    </Box>
  );
};

export default DeviceInfoPanel;
