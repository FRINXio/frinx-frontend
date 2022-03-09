import React, { VoidFunctionComponent } from 'react';
import {
  removeElements,
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
  EdgeProps,
  useStoreState,
} from 'react-flow-renderer';
import { Box, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const foreignObjectSize = 40;

const ButtonEdge: VoidFunctionComponent<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  arrowHeadType,
  markerEndId,
}) => {
  const edges = useStoreState((state) => state.edges);

  const handleEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>, edgeId: string) => {
    evt.stopPropagation();
    const edgeToRemove = edges.find((e) => e.id === edgeId);

    if (edgeToRemove) {
      console.log(edgeToRemove); // eslint-disable-line no-console
      removeElements([edgeToRemove], edges);
    }
  };
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Box
          width="40px"
          height="40px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          background="transparent"
        >
          <IconButton
            aria-label="Remove edge"
            borderRadius="50%"
            size="xs"
            icon={<CloseIcon />}
            onClick={(event) => handleEdgeClick(event, id)}
          />
        </Box>
      </foreignObject>
    </>
  );
};

export default ButtonEdge;
