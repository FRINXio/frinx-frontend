import { Box, Button } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import { clearGmPathSearch, setSelectedNode, updateSynceNodePosition } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './synce-edges';
import { height, Position, width } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import SynceNodes from './synce-nodes';
import { SynceGraphNode } from '../../../__generated__/graphql';
import SynceInfoPanel from './synce-info-panel';

type Props = {
  isGrandMasterPathFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onGrandMasterPathSearch: (nodeIds: string[]) => void;
};

const SynceTopologyGraph: VoidFunctionComponent<Props> = ({
  isGrandMasterPathFetching,
  onNodePositionUpdate,
  onGrandMasterPathSearch,
}) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const {
    synceEdges: edges,
    synceNodes: nodes,
    selectedNode,
    unconfirmedSelectedNodeIds,
    unconfirmedSelectedGmPathNodeId,
  } = state;

  const handleNodePositionUpdate = (deviceName: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.name === deviceName));
    lastPositionRef.current = { deviceName: node.name, position };
    dispatch(updateSynceNodePosition(deviceName, position));
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

  const handleClearGmPath = () => {
    dispatch(clearGmPathSearch());
  };

  const handleSearchClick = () => {
    onGrandMasterPathSearch(unconfirmedSelectedNodeIds);
  };

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edgesWithDiff={edges} />
        <SynceNodes
          nodes={nodes}
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
          <SynceInfoPanel node={selectedNode as SynceGraphNode} onClose={handleInfoPanelClose} />
        </Box>
      )}
      {unconfirmedSelectedGmPathNodeId && (
        <Box position="absolute" top={2} left="2" background="transparent">
          <Button onClick={handleClearGmPath} marginRight={2}>
            Clear GM path
          </Button>
          <Button onClick={handleSearchClick} isDisabled={isGrandMasterPathFetching} marginRight={2}>
            Find GM path
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SynceTopologyGraph;