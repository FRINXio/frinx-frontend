import { Badge, Box, Button, Divider, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { PtpGraphNode } from '../../../__generated__/graphql';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNodeInterface } from '../graph.helpers';

type Props = {
  onClose: () => void;
  node: PtpGraphNode;
};

const PtpInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const [isShowingAdditionalInfo, setIsShowingAdditionalInfo] = React.useState(false);
  const { state, dispatch } = useStateContext();
  const { ptpEdges } = state;
  const { ptpDeviceDetails: details, interfaces } = node;

  const handleInterfaceClick = (deviceInterface: GraphNodeInterface) => {
    const [edge] = ptpEdges.filter((e) => e.id.startsWith(deviceInterface.id));
    if (!edge) {
      return;
    }
    dispatch(setSelectedEdge(edge));
  };

  return (
    <HStack
      position="absolute"
      top={2}
      right={2}
      background="white"
      borderRadius="md"
      paddingX={4}
      paddingY={6}
      boxShadow="md"
      spacing={4}
    >
      <Box>
        <Flex alignItems="center">
          <Heading as="h3" size="sm">
            {node.name}
          </Heading>
          <Badge marginLeft="auto">{node.status}</Badge>
        </Flex>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            PTP Profile
          </Heading>
          {details.ptpProfile}
        </Box>
        <Box mt={2}>
          <Heading as="h4" fontSize="xs">
            Clock Type
          </Heading>
          {details.clockType}
        </Box>
        <Divider m={1} />
        <Box mt={2}>
          <Heading as="h4" fontSize="sm">
            Interfaces
          </Heading>
          {interfaces.map((i) => {
            return (
              <Box key={`device-interface-${i.id}`}>
                <Button as={Link} onClick={() => handleInterfaceClick(i)}>
                  {i.name}
                </Button>
                <Text>{i.status}</Text>
              </Box>
            );
          })}
        </Box>
        <Button
          marginTop={4}
          aria-label="show additional"
          variant="outline"
          size="sm"
          onClick={() => {
            setIsShowingAdditionalInfo((prev) => !prev);
          }}
        >
          Additional info
        </Button>
        <HStack spacing={2} marginTop={4}>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </HStack>
      </Box>
      {isShowingAdditionalInfo && (
        <VStack spacing={2} marginTop={4} align="flex-start" mx={5}>
          <Heading as="h4" fontSize="xs">
            Clock class
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.clockClass || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            Clock accuracy
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.clockAccuracy || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            Clock variance
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.clockVariance || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            Time recovery status
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.timeRecoveryStatus || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            Domain
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.domain || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            Global priority
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.globalPriority || 'N/A'}
          </Text>

          <Heading as="h4" fontSize="xs">
            User priority
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {details.userPriority || 'N/A'}
          </Text>
        </VStack>
      )}
    </HStack>
  );
};

export default PtpInfoPanel;
