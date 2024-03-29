import { Badge, Box, Button, Divider, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { PtpGraphNode } from '../../../__generated__/graphql';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNodeInterface } from '../graph.helpers';
import DeviceInfoPanelAdditionalInfo from '../../../components/device-info-panel/device-info-panel-additional-info';

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
      alignItems="flex-start"
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
            Clock Id
          </Heading>
          {details.clockId}
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
              <Box key={`device-interface-${i.id}`} my={2}>
                <Button as={Link} onClick={() => handleInterfaceClick(i)}>
                  {i.name}
                </Button>
                <Text fontSize="xs" textColor="GrayText">
                  <strong>Status:</strong> {i.status}
                </Text>
                <Text fontSize="xs" textColor="GrayText">
                  <strong>Admin op. status:</strong> {i.details?.adminOperStatus}
                </Text>
                <Text fontSize="xs" textColor="GrayText">
                  <strong>PTP status:</strong> {i.details?.ptpStatus}
                </Text>
                <Text fontSize="xs" textColor="GrayText">
                  <strong>PTSF unusable:</strong> {i.details?.ptsfUnusable}
                </Text>
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
      {isShowingAdditionalInfo && <DeviceInfoPanelAdditionalInfo additionalInfo={details} />}
    </HStack>
  );
};

export default PtpInfoPanel;
