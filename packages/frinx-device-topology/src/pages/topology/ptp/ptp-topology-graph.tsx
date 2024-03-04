import { Box, Button, Text } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import PtpInfoPanel from './ptp-info-panel';
import { clearGmPathSearch, setSelectedNode, updatePtpNodePosition } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './ptp-edges';
import { height, Position, width } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import PtpNodes from './ptp-nodes';
import { PtpGraphNode } from '../../../__generated__/graphql';
import { getGmPathHopsCount } from '../../../helpers/topology-helpers';

type Props = {
  ptpDiffSynceIds: string[];
  isPtpDiffSynceShown: boolean;
  isGrandMasterPathFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onGrandMasterPathSearch: (nodeIds: string[]) => void;
};

const PtpTopologyGraph: VoidFunctionComponent<Props> = ({
  ptpDiffSynceIds,
  isPtpDiffSynceShown,
  isGrandMasterPathFetching,
  onNodePositionUpdate,
  onGrandMasterPathSearch,
}) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const {
    ptpEdges: edges,
    ptpNodes: nodes,
    selectedNode,
    gmPathIds,
    unconfirmedSelectedNodeIds,
    unconfirmedSelectedGmPathNodeId,
  } = state;

  const handleNodePositionUpdate = (deviceName: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.name === deviceName));
    lastPositionRef.current = { deviceName: node.name, position };
    dispatch(updatePtpNodePosition(deviceName, position));
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
    <Box
      background="white"
      borderRadius="md"
      position="relative"
      backgroundImage={`url(${BackgroundSvg})`}
      overflow="scroll"
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edgesWithDiff={edges} />
        <PtpNodes
          isPtpDiffSynceShown={isPtpDiffSynceShown}
          ptpDiffSynceIds={ptpDiffSynceIds}
          nodes={nodes}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
        />
      </svg>
      {selectedNode != null && <PtpInfoPanel node={selectedNode as PtpGraphNode} onClose={handleInfoPanelClose} />}
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
              <Text fontWeight="600">Number of hops: {getGmPathHopsCount(gmPathIds, 'PtpDevice')}</Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PtpTopologyGraph;
