import { Box } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import { clearGmPathSearch, setSelectedNode, updateMplsNodePosition } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './mpls-edges';
import { height, Position, width, MplsGraphNode } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import MplsNodes from './mpls-nodes';
import MplsInfoPanel from './mpls-info-panel';
import LspCounts from './lsp-counts';

type Props = {
  isLspCountFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
};

const MplsTopologyGraph: VoidFunctionComponent<Props> = ({ isLspCountFetching, onNodePositionUpdate }) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { mplsEdges: edges, mplsNodes: nodes, selectedNode, lspCounts } = state;

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

  console.log('lsp counts container', lspCounts);

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
      {selectedNode != null && <MplsInfoPanel node={selectedNode as MplsGraphNode} onClose={handleInfoPanelClose} />}
    </Box>
  );
};

export default MplsTopologyGraph;
