import { Box, Button } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { clearCommonSearch, setSelectedNode, updateNodePosition } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import Edges from './edges';
import { ensureNodeHasDevice, height, Position, width } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './lldp/nodes';

type Props = {
  isCommonNodesFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onCommonNodesSearch: (nodeIds: string[]) => void;
};

const TopologyGraph: VoidFunctionComponent<Props> = ({
  isCommonNodesFetching,
  onNodePositionUpdate,
  onCommonNodesSearch,
}) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { edges, nodes, selectedNode, unconfirmedSelectedNodeIds } = state;

  const handleNodePositionUpdate = (deviceName: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.device.name === deviceName));
    lastPositionRef.current = { deviceName: node.device.name, position };
    dispatch(updateNodePosition(deviceName, position));
  };

  const handleNodePositionUpdateFinish = () => {
    if (lastPositionRef.current) {
      positionListRef.current.push(lastPositionRef.current);
      lastPositionRef.current = null;
      timeoutRef.current = Number(
        setTimeout(() => {
          onNodePositionUpdate(positionListRef.current).then(() => {
            positionListRef.current = [];
            clearTimeout(timeoutRef.current);
          });
        }, 3000),
      );
    }
  };

  const handleInfoPanelClose = () => {
    dispatch(setSelectedNode(null));
  };

  const handleClearCommonSearch = () => {
    dispatch(clearCommonSearch());
  };

  const handleSearchClick = () => {
    onCommonNodesSearch(unconfirmedSelectedNodeIds);
  };

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edgesWithDiff={edges} />
        <Nodes
          nodesWithDiff={nodes}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
        />
      </svg>
      {selectedNode != null && ensureNodeHasDevice(selectedNode) && (
        <Box
          position="absolute"
          top={2}
          right={2}
          background="white"
          borderRadius="md"
          paddingX={4}
          paddingY={6}
          width={60}
          boxShadow="md"
        >
          <DeviceInfoPanel
            deviceId={selectedNode.device.id}
            onClose={handleInfoPanelClose}
            deviceType={selectedNode.deviceType}
            softwareVersion={selectedNode.softwareVersion}
          />
        </Box>
      )}
      {!!unconfirmedSelectedNodeIds.length && (
        <Box position="absolute" top={2} left="2" background="transparent">
          <Button onClick={handleClearCommonSearch}>Clear common search</Button>
          <Button onClick={handleSearchClick} isDisabled={isCommonNodesFetching}>
            Find common nodes
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TopologyGraph;
