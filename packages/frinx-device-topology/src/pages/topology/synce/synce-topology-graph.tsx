import { Box } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { useRef, VoidFunctionComponent } from 'react';
import { updateSynceNodePosition } from '../../../state.actions';
import { useStateContext } from '../../../state.provider';
import Edges from './synce-edges';
import { height, Position, width } from '../graph.helpers';
import BackgroundSvg from '../img/background.svg';
import SynceNodes from './synce-nodes';

type Props = {
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
};

const SynceTopologyGraph: VoidFunctionComponent<Props> = ({ onNodePositionUpdate }) => {
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { synceEdges: edges, synceNodes: nodes } = state;

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
    </Box>
  );
};

export default SynceTopologyGraph;
