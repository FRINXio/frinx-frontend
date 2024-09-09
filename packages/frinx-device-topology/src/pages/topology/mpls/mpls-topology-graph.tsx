import { Box, Button, Select } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import {
  clearLspPathSearch,
  setSelectedNode,
  setUnconfimedNodeIdForLspPathSearch,
  updateMplsNodePosition,
} from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './mpls-edges';
import { height, Position, width, MplsGraphNode } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import MplsNodes from './mpls-nodes';
import MplsInfoPanel from './mpls-info-panel';
import LspCounts from './lsp-counts';
import MplsLspPanel from './mpls-isp-panel';

type Props = {
  isLspPathFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onLspPathSearch: (nodeIds: string[]) => void;
};

const MplsTopologyGraph: VoidFunctionComponent<Props> = ({
  isLspPathFetching,
  onNodePositionUpdate,
  onLspPathSearch,
}) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const {
    mplsEdges: edges,
    mplsNodes: nodes,
    selectedNode,
    selectedLspId,
    lspPathMetadata,
    lspPathIds,
    lspCounts,
    unconfirmedSelectedLspPathNodeId,
    unconfirmedSelectedNodeIds,
  } = state;

  const handleNodePositionUpdate = (deviceName: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.name === deviceName));
    lastPositionRef.current = { deviceName: node.name, position };
    dispatch(updateMplsNodePosition(deviceName, position));
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

  const handleLspPanelClose = () => {
    dispatch(clearLspPathSearch());
  };

  const handleClearLspPath = () => {
    dispatch(clearLspPathSearch());
  };

  const handleSearchClick = () => {
    onLspPathSearch(unconfirmedSelectedNodeIds);
  };

  const handleLspIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentTarget } = event;
    const { value: lspId } = currentTarget;
    if (!unconfirmedSelectedLspPathNodeId) {
      return;
    }
    dispatch(setUnconfimedNodeIdForLspPathSearch(unconfirmedSelectedLspPathNodeId, lspId));
  };

  const isLspPanelOpen = lspPathMetadata;
  const isInfoPanelOpen = !isLspPanelOpen && selectedNode != null;
  const [pathStart] = lspPathIds;
  const [pathEnd] = [...lspPathIds].reverse();

  return (
    <Box background="white" borderRadius="md" position="relative" backgroundImage={`url(${BackgroundSvg})`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Edges edgesWithDiff={edges} />
        <MplsNodes
          nodes={nodes}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
        />
        {selectedNode && <LspCounts edges={edges} lspCounts={lspCounts} />}
      </svg>
      {isInfoPanelOpen && <MplsInfoPanel node={selectedNode as MplsGraphNode} onClose={handleInfoPanelClose} />}
      {isLspPanelOpen && (
        <MplsLspPanel
          onClose={handleLspPanelClose}
          pathStart={pathStart}
          pathEnd={pathEnd}
          metadata={lspPathMetadata}
        />
      )}
      {unconfirmedSelectedLspPathNodeId && (
        <Box position="absolute" top={2} left="2" minWidth={300} background="transparent">
          <Box display="flex" alignItems="center">
            <Button onClick={handleClearLspPath} marginRight={2}>
              Clear Lsp path
            </Button>
            <Button onClick={handleSearchClick} isDisabled={!selectedLspId || isLspPathFetching} marginRight={2}>
              Find Lsp path
            </Button>
            <Select onChange={handleLspIdChange} maxWidth={200} background="white">
              <option>-- choose lsp id</option>
              {nodes
                .find((n) => n.id === unconfirmedSelectedLspPathNodeId)
                ?.details.lspTunnels.map((t) => (
                  <option key={t.lspId} value={t.lspId}>
                    {t.lspId}
                  </option>
                ))}
            </Select>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MplsTopologyGraph;
