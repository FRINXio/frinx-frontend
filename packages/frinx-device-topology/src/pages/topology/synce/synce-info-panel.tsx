import { Badge, Box, Button, Divider, Flex, Heading, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { SynceGraphNode } from '../../../__generated__/graphql';
import { setSelectedEdge } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import { GraphNodeInterface } from '../graph.helpers';
import DeviceInfoPanelAdditionalInfo from '../../../components/device-info-panel/device-info-panel-additional-info';

type Props = {
  onClose: () => void;
  node: SynceGraphNode;
};

const SynceInfoPanel: VoidFunctionComponent<Props> = ({ onClose, node }) => {
  const [isShowingAdditionalInfo, setIsShowingAdditionalInfo] = React.useState(false);
  const { state, dispatch } = useStateContext();
  const { synceEdges } = state;
  const { synceDeviceDetails: details } = node;

  const { interfaces } = node;

  const handleInterfaceClick = (deviceInterface: GraphNodeInterface) => {
    const [edge] = synceEdges.filter((e) => e.id.startsWith(deviceInterface.id));
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
            Selected for use
          </Heading>
          {details.selectedForUse}
        </Box>
        <Divider m={1} />
        <Box mt={2}>
          <Heading as="h4" fontSize="sm">
            Interfaces
          </Heading>

          <Box key={`device-interface-${node.id}`}>
            <Button as={Link} onClick={() => handleInterfaceClick(node.interfaces[0])}>
              {node.interfaces[0].name}
            </Button>
          </Box>
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
      {isShowingAdditionalInfo &&
        interfaces.map((i) => {
          return (
            <DeviceInfoPanelAdditionalInfo key={i?.id} interfaceName={i?.name} additionalInfo={i?.details ?? {}} />
          );
        })}
    </HStack>
  );
};

export default SynceInfoPanel;
