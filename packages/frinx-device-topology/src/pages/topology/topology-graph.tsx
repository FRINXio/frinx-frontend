import { Box, Button } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared/src';
import React, { FunctionComponent, useRef } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { Change, getEdgesWithDiff, getNodesWithDiff } from '../../helpers/topology-helpers';
import { clearCommonSearch, setSelectedNode, updateNodePosition } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import Edges from './edges';
import { Position } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './nodes';

const width = 1248;
const height = 600;

// eslint-disable-next-line no-shadow
export enum DeviceSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

type Props = {
  isCommonNodesFetching: boolean;
  onNodePositionUpdate: (positions: { deviceId: string; position: Position }[]) => Promise<void>;
  onCommonNodesSearch: (nodeIds: string[]) => void;
};

const TopologyGraph: FunctionComponent<Props> = ({
  isCommonNodesFetching,
  onNodePositionUpdate,
  onCommonNodesSearch,
}) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceId: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceId: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { backupEdges, backupNodes, edges, nodes, selectedNode, selectedVersion, unconfirmedSelectedNodeIds } = state;

  const nodesWithDiff =
    selectedVersion && backupNodes
      ? getNodesWithDiff(nodes, backupNodes)
      : nodes.map((n) => ({ ...n, change: 'NONE' as Change }));

  const edgesWithDiff =
    selectedVersion && backupEdges
      ? getEdgesWithDiff(edges, backupEdges)
      : edges.map((e) => ({ ...e, change: 'NONE' as Change }));

  const handleNodePositionUpdate = (nodeId: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodesWithDiff.find((n) => n.device.name === nodeId));
    lastPositionRef.current = { deviceId: node.device.id, position };
    dispatch(updateNodePosition(nodeId, position));
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
        <Edges edgesWithDiff={edgesWithDiff} />
        <Nodes
          nodesWithDiff={nodesWithDiff}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
        />
      </svg>
      {selectedNode != null && (
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
      {unconfirmedSelectedNodeIds.length && (
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
