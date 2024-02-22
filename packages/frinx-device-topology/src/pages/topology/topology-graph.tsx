import { Box, Button } from '@chakra-ui/react';
import { unwrap } from '@frinx/shared';
import React, { PointerEventHandler, useRef, useState, VoidFunctionComponent, WheelEvent } from 'react';
import DeviceInfoPanel from '../../components/device-info-panel/device-info-panel';
import { clearCommonSearch, panTopology, setSelectedNode, updateNodePosition, zoomTopology } from '../../state.actions';
import { useStateContext } from '../../state.provider';
import Edges from './edges';
import { ensureNodeHasDevice, height, Position, width } from './graph.helpers';
import BackgroundSvg from './img/background.svg';
import Nodes from './lldp/nodes';
import { normalizeWheelPixelY } from './topology.helpers';
import { getTransformMatrix } from './transform.helpers';

// These constant were chosen empirically:
// mouse-wheel for zooming (ALL TOOLS)
const WHEEL_ZOOM_COEFFICIENT = 1000;

type Props = {
  isCommonNodesFetching: boolean;
  onNodePositionUpdate: (positions: { deviceName: string; position: Position }[]) => Promise<void>;
  onCommonNodesSearch: (nodeIds: string[]) => void;
};

type PanState = {
  isMouseDown: boolean;
  oldPan?: Position | null;
};

const TopologyGraph: VoidFunctionComponent<Props> = ({
  isCommonNodesFetching,
  onNodePositionUpdate,
  onCommonNodesSearch,
}) => {
  const elementRef = useRef<SVGSVGElement | null>(null);
  const [panState, setPanState] = useState<PanState>({
    isMouseDown: false,
    oldPan: null,
  });
  const { state, dispatch } = useStateContext();
  const lastPositionRef = useRef<{ deviceName: string; position: Position } | null>(null);
  const positionListRef = useRef<{ deviceName: string; position: Position }[]>([]);
  const timeoutRef = useRef<number>();
  const { edges, nodes, selectedNode, unconfirmedSelectedNodeIds, transform } = state;
  const transformMatrix = getTransformMatrix(transform);

  const handlePointerDown: PointerEventHandler<SVGGElement> = (event) => {
    const svgEl = elementRef.current;
    if (svgEl == null) {
      return;
    }
    const { clientX, clientY } = event;
    const svgPoint = new DOMPoint(clientX, clientY);
    const svgPosition = svgPoint.matrixTransform(svgEl.getScreenCTM()?.inverse());

    setPanState({
      isMouseDown: true,
      oldPan: svgPosition,
    });
  };

  const handlePointerUp = () => {
    setPanState({
      isMouseDown: false,
    });
  };
  const handlePointerMove: PointerEventHandler<SVGSVGElement> = (event) => {
    const { clientX, clientY } = event;
    const svgPoint = new DOMPoint(clientX, clientY);
    event.preventDefault();

    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;

    const svgEl = elementRef.current;
    if (!svgEl) {
      return;
    }
    const svgPosition = svgPoint.matrixTransform(svgEl.getScreenCTM()?.inverse());

    if (panState.isMouseDown) {
      if (panState.oldPan == null) {
        throw new Error('should never happen');
      }

      // we need to calculate delta so we can pan both images in locking state
      const deltaX = svgPosition.x - panState.oldPan.x;
      const deltaY = svgPosition.y - panState.oldPan.y;
      setPanState({
        isMouseDown: true,
        oldPan: {
          x: svgPosition.x,
          y: svgPosition.y,
        },
      });
      dispatch(
        panTopology({
          x: deltaX,
          y: deltaY,
        }),
      );
    }
  };

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const delta = normalizeWheelPixelY(event);

    // if alt, ctrl, cmd or shift is down apply rotation
    if (event.metaKey || event.shiftKey) {
      dispatch(zoomTopology(1 + delta / WHEEL_ZOOM_COEFFICIENT));
    }
  };

  const handleNodePositionUpdate = (deviceName: string, position: Position) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
    const node = unwrap(nodes.find((n) => n.name === deviceName));
    lastPositionRef.current = { deviceName: node.name, position };
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
      <svg
        ref={elementRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onWheel={handleWheel}
      >
        <g transform={`matrix(${transformMatrix.toString()})`}>
          <Edges edgesWithDiff={edges} />
          <Nodes
            nodesWithDiff={nodes}
            onNodePositionUpdate={handleNodePositionUpdate}
            onNodePositionUpdateFinish={handleNodePositionUpdateFinish}
          />
        </g>
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
            name={selectedNode.name}
            device={selectedNode.device}
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
