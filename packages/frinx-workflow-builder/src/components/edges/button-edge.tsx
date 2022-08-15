import { Box, IconButton, Icon } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { EdgeProps, getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import { useEdgeRemoveContext } from '../../edge-remove-context';
import FeatherIcon from 'feather-icons-react';

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
  markerEnd,
}) => {
  const { removeEdge } = useEdgeRemoveContext();

  const handleEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>, edgeId: string) => {
    evt.stopPropagation();
    removeEdge(edgeId);
  };
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  // const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
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
            icon={<Icon as={FeatherIcon} icon="x" size={20} />}
            onClick={(event) => handleEdgeClick(event, id)}
          />
        </Box>
      </foreignObject>
    </>
  );
};

export default ButtonEdge;
