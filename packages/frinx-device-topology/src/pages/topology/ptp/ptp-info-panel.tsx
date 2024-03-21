import { Badge, Box, Button, Divider, Flex, Heading, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { PtpGraphNode, GraphPtpNodeInterface, normalizeNodeInterfaceData } from '../graph.helpers';
import DeviceInfoPanelAdditionalInfo from '../../../components/device-info-panel/device-info-panel-additional-info';

type Props = {
  onClose: () => void;
  node: PtpGraphNode;
};

const PtpInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const [activeInterface, setActiveInterface] = useState<GraphPtpNodeInterface | null>(null);
  const [isShowingAdditionalInfo, setIsShowingAdditionalInfo] = useState(false);
  const { state, dispatch } = useStateContext();
  const { ptpEdges } = state;
  const { details, interfaces } = node;

  const handleInterfaceClick = (deviceInterface: GraphPtpNodeInterface) => {
    const [edge] = ptpEdges.filter((e) => e.source.interface.startsWith(deviceInterface.id));
    if (!edge) {
      return;
    }
    dispatch(setSelectedEdge(edge));
    setActiveInterface(deviceInterface);
  };

  const handleClose = () => {
    onClose();
    setActiveInterface(null);
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
                <Button as={Link} onClick={() => handleInterfaceClick(i)} variant="link">
                  {i.name}
                </Button>
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
          <Button size="sm" onClick={handleClose}>
            Close
          </Button>
        </HStack>
      </Box>
      {isShowingAdditionalInfo && <DeviceInfoPanelAdditionalInfo additionalInfo={details} />}
      {activeInterface && (
        <DeviceInfoPanelAdditionalInfo additionalInfo={normalizeNodeInterfaceData(activeInterface)} />
      )}
    </HStack>
  );
};

export default PtpInfoPanel;
