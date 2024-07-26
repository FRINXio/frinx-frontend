import { Box, Button, Text } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import { clearGmPathSearch, setSelectedNode, updateSynceNodePosition } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './mpls-edges';
import { height, Position, width, MplsGraphNode } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import MplsNodes from './mpls-nodes';
import MplsInfoPanel from './mpls-info-panel';
import { getGmPathHopsCount } from '../../../helpers/topology-helpers';

type Props = {
  isGrandMasterPathFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onGrandMasterPathSearch: (nodeIds: string[]) => void;
};

const MplsTopologyGraph: VoidFunctionComponent<Props> = ({
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
    gmPathIds,
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
        <MplsNodes
          nodes={nodes}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
        />
      </svg>
      {selectedNode != null && <MplsInfoPanel node={selectedNode as MplsGraphNode} onClose={handleInfoPanelClose} />}
      {unconfirmedSelectedGmPathNodeId && (
        <Box position="absolute" top={2} left="2" background="transparent">
          <Box display="flex" alignItems="center">
            <Button onClick={handleClearGmPath} marginRight={2}>
              Clear GM path
            </Button>
            <Button onClick={handleSearchClick} isDisabled={isGrandMasterPathFetching} marginRight={2}>
              Find GM path
            </Button>
            {gmPathIds.length > 0 && (
              <Text fontWeight="600">Number of hops: {getGmPathHopsCount(gmPathIds, 'SynceDevice')}</Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MplsTopologyGraph;
