import unwrap from '@frinx/shared/src/helpers/unwrap';
import { GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { DeviceSize } from '../../__generated__/graphql';

export const width = 1248;
export const height = 600;

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export type Position = {
  x: number;
  y: number;
};

export type Device = {
  id: string;
  name: string;
  deviceSize: DeviceSize;
  isInstalled: boolean;
  createdAt: string;
  serviceState: string;
};

export type GraphNodeInterface = {
  id: string;
  status: 'ok' | 'unknown';
  name: string;
};

export type GraphNetNodeInterface = {
  id: string;
  name: string;
};

export type GraphNode = {
  id: string;
  name: string;
  device: Device | null;
  deviceType: string | null;
  softwareVersion: string | null;
  interfaces: GraphNodeInterface[];
  coordinates: Position;
};

export type PtpGraphNodeDetails = {
  clockAccuracy: string | null;
  clockClass: number | null;
  clockId: string;
  clockType: string | null;
  clockVariance: string | null;
  domain: number;
  globalPriority: number | null;
  gmClockId: string;
  parentClockId: string;
  ptpProfile: string;
  timeRecoveryStatus: string | null;
  userPriority: number | null;
};

export type PtpGraphNode = {
  id: string;
  name: string;
  interfaces: GraphPtpNodeInterface[];
  coordinates: Position;
  nodeId: string;
  status: string;
  details: PtpGraphNodeDetails;
};

export type SynceGraphNodeDetails = {
  selectedForUse: string | null;
};

export type SynceGraphNode = {
  id: string;
  name: string;
  nodeId: string;
  interfaces: GraphSynceNodeInterface[];
  coordinates: Position;
  details: SynceGraphNodeDetails;
  status: string;
};

export type SourceTarget = {
  nodeId: string;
  interface: string;
};
export type GraphEdge = {
  id: string;
  weight: number | null;
  source: SourceTarget;
  target: SourceTarget;
};

export type NetNetwork = {
  id: string;
  subnet: string;
  coordinates: Position;
};

export type GrahpNetNodeInterface = {
  id: string;
  name: string;
};

export type GraphNetNode = {
  id: string;
  nodeId: string;
  name: string;
  interfaces: GrahpNetNodeInterface[];
  networks: NetNetwork[];
  coordinates: Position;
};

export type BackupGraphNode = {
  id: string;
  name: string;
  interfaces: GraphNodeInterface[];
  coordinates: Position;
};

export type GraphPtpNodeInterfaceDetails = {
  ptpStatus: string | null;
  adminOperStatus: string | null;
  ptsfUnusable: string | null;
};

export type BackupNetGraphNode = {
  id: string;
  name: string;
  interfaces: GraphNetNodeInterface[];
  networks: NetNetwork[];
  coordinates: Position;
};

export type GraphPtpNodeInterface = {
  id: string;
  name: string;
  status: string;
  details: GraphPtpNodeInterfaceDetails | null;
};

export type SynceGraphNodeInterfaceDetails = {
  isSynceEnabled: boolean;
  rxQualityLevel: string | null;
  qualifiedForUse: string | null;
  notQualifiedDueTo: string | null;
  notSelectedDueTo: string | null;
};

export type GraphSynceNodeInterface = {
  id: string;
  name: string;
  status: string;
  details: SynceGraphNodeInterfaceDetails | null;
};

export const NODE_CIRCLE_RADIUS = 30;

export type PositionsMap = {
  nodes: Record<string, Position>;
  interfaces: Record<string, Position>;
};
export type PositionsWithGroupsMap<S extends { id: string; name: string }> = {
  nodes: Record<string, Position>;
  interfaceGroups: PositionGroupsMap<S>;
};
type GroupName = string;
export type GroupData<S extends { id: string; name: string }> = {
  position: Position;
  interfaces: S[];
};
export type PositionGroupsMap<S extends { id: string; name: string }> = Record<GroupName, GroupData<S>>;

export function getAngleBetweenPoints(p1: Position, p2: Position): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function getDistanceBetweenPoints(p1: Position, p2: Position): number {
  return Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
}

export type UpdateInterfacePositionParams<
  S extends { id: string; name: string },
  T extends { coordinates: Position; interfaces: S[] },
> = {
  nodes: T[];
  edges: GraphEdge[];
  positionMap: Record<string, Position>;
};

export function getDeviceSizeDiameter(deviceSize: DeviceSize): number {
  switch (deviceSize) {
    case 'LARGE':
      return NODE_CIRCLE_RADIUS * 2;
    case 'MEDIUM':
      return NODE_CIRCLE_RADIUS * 1.5;
    default:
      return NODE_CIRCLE_RADIUS;
  }
}

export function getInterfacesPositions<
  S extends { id: string; name: string },
  T extends { name: string; coordinates: Position; interfaces: S[] },
>(
  { nodes, edges, positionMap }: UpdateInterfacePositionParams<S, T>,
  getDeviceSize: (node: T) => DeviceSize,
): PositionGroupsMap<S> {
  const nodesMap = new Map(nodes.map((n) => [n.name, n]));
  const allInterfaces = nodes.map((n) => n.interfaces).flat();
  const result = allInterfaces.reduce((acc: PositionGroupsMap<S>, curr) => {
    const targets = edges.filter((e) => e.source.interface === curr.id);

    // we traverse trough all edges that is current interface is targeting
    // and create position group for those
    const changedGroups: PositionGroupsMap<S> = targets.reduce((groupsAcc: PositionGroupsMap<S>, edge) => {
      const groupName = `${edge.source.nodeId},${edge.target.nodeId}`;
      const pos1 = positionMap[edge.source.nodeId];
      const pos2 = positionMap[edge.target.nodeId];

      // we cant rely on consistent data
      // for example when filtering nodes, we cant be sure if all edges have exisitng nodes
      // even if we do so on server
      if (!pos1 || !pos2) {
        return groupsAcc;
      }

      const angle = getAngleBetweenPoints(pos1, pos2);
      const nodeDiameter = getDeviceSizeDiameter(getDeviceSize(unwrap(nodesMap.get(edge.source.nodeId))));
      const y = nodeDiameter * Math.sin(angle);
      const x = nodeDiameter * Math.cos(angle);
      const newInterfaces = acc[groupName] ? [...acc[groupName].interfaces, curr] : [curr];
      return {
        ...groupsAcc,
        [groupName]: {
          position: { x: pos1.x + x, y: pos1.y + y },
          interfaces: newInterfaces,
        },
      };
    }, {});

    return { ...acc, ...changedGroups };
  }, {});

  return result;
}

export type NodesEdgesParam<T extends { coordinates: Position }> = {
  nodes: T[];
  edges: GraphEdge[];
};

export function getDefaultPositionsMap<
  S extends { id: string; name: string },
  T extends { name: string; coordinates: Position; interfaces: S[] },
>(
  { nodes, edges }: NodesEdgesParam<T>,
  getNodeName: (node: T) => string,
  getDeviceSize: (node: T) => DeviceSize,
): PositionsWithGroupsMap<S> {
  const nodesMap = nodes.reduce(
    (acc, curr) => {
      const { coordinates } = curr;
      return {
        ...acc,
        [getNodeName(curr)]: { x: coordinates.x * width, y: coordinates.y * height },
      };
    },
    {} as Record<string, Position>,
  );
  return {
    nodes: nodesMap,
    interfaceGroups: getInterfacesPositions({ nodes, edges, positionMap: nodesMap }, getDeviceSize),
  };
}

export function getPointOnCircle(source: Position, target: Position, radius = 1): Position {
  const angle = getAngleBetweenPoints(source, target);
  const y = radius * Math.sin(angle);
  const x = radius * Math.cos(angle);
  return {
    x: source.x + x,
    y: source.y + y,
  };
}

export type GetPointsOnSlopeParams = { source: Position; target: Position; radius: number; length?: number };

export function getPointOnSlope({ source, target, radius, length = 1 }: GetPointsOnSlopeParams): Position {
  const angle = getAngleBetweenPoints(source, target);
  const perpendicularAngle = angle + Math.PI / 2;
  const circlePoint = getPointOnCircle(source, target, radius);
  const y = circlePoint.y + length * Math.sin(perpendicularAngle);
  const x = circlePoint.x + length * Math.cos(perpendicularAngle);
  return {
    x,
    y,
  };
}

export function getDistanceFromLineList<S extends { id: string; name: string }>(interfaces: S[]): number[] {
  const numberOfPoints = interfaces.length;
  return [...Array(numberOfPoints).keys()].map((p) => p - (numberOfPoints - 1) / 2);
}

export function getInterfaceGroupName(sourceId: string, targetId: string) {
  return `${sourceId},${targetId}`;
}

export type GetLinePointsParams<S extends { id: string; name: string }> = {
  edge: GraphEdge;
  connectedNodeIds: string[];
  nodePositions: Record<string, Position>;
  interfaceGroupPositions: PositionGroupsMap<S>;
};

export type Line = {
  start: Position;
  end: Position;
};

export function getLinePoints<S extends { id: string; name: string }>({
  edge,
  connectedNodeIds,
  nodePositions,
  interfaceGroupPositions,
}: GetLinePointsParams<S>): Line | null {
  const sourcePosition = connectedNodeIds.includes(edge.source.nodeId)
    ? interfaceGroupPositions[getInterfaceGroupName(edge.source.nodeId, edge.target.nodeId)]?.position
    : nodePositions[edge.source.nodeId];
  const targetPosition = connectedNodeIds.includes(edge.target.nodeId)
    ? interfaceGroupPositions[getInterfaceGroupName(edge.target.nodeId, edge.source.nodeId)]?.position
    : nodePositions[edge.target.nodeId];

  if (!sourcePosition || !targetPosition) {
    return null;
  }

  return {
    start: sourcePosition,
    end: targetPosition,
  };
}

export type GetControlPointsParams<S extends { id: string; name: string }> = {
  edge: GraphEdge;
  interfaceGroupPositions: PositionGroupsMap<S>;
  sourcePosition: Position;
  targetPosition: Position;
  edgeGap: number;
};

// control points for curved line
export function getControlPoints<S extends { id: string; name: string }>({
  edge,
  interfaceGroupPositions,
  sourcePosition,
  targetPosition,
  edgeGap,
}: GetControlPointsParams<S>): Position[] {
  const groupName = getInterfaceGroupName(edge.target.nodeId, edge.source.nodeId);
  const groupData = interfaceGroupPositions[groupName];
  const distanceFromLineList = getDistanceFromLineList(groupData.interfaces);
  const index = groupData.interfaces.map((i) => i.id).indexOf(edge.target.interface);
  const length = edgeGap * distanceFromLineList[index];

  const nodesDistance = getDistanceBetweenPoints(sourcePosition, targetPosition);
  const bezierCurveHandlePosition = getPointOnSlope({
    source: sourcePosition,
    target: targetPosition,
    radius: nodesDistance / 2,
    length,
  });
  return [bezierCurveHandlePosition];
}

export function getCurvePath(source: Position, target: Position, controlPoints: Position[]): string {
  return `M ${source.x},${source.y} Q${controlPoints.map((p) => `${p.x},${p.y}`)} ${target.x},${target.y}`;
}

export function getInterfaceStatusColor(interfaceDetails: GraphPtpNodeInterfaceDetails): string {
  const { adminOperStatus, ptpStatus, ptsfUnusable } = interfaceDetails;

  if (adminOperStatus === 'up/up' && ptpStatus === 'master') {
    return 'green';
  } else if (adminOperStatus?.startsWith('up/') && (ptpStatus === 'slave' || ptpStatus === 'uncalibrated')) {
    return 'blue';
  } else if (adminOperStatus?.startsWith('up/') && ptpStatus === 'passive') {
    return 'orange';
  } else if (ptsfUnusable !== null && ptsfUnusable !== 'ok') {
    return 'red';
  } else {
    return 'transparent';
  }
}

export function isTargetingActiveNode<S extends { id: string; name: string }>(
  edge: GraphEdge,
  selectedNodeName: string | null,
  interfaceGroupPositions: PositionGroupsMap<S>,
): boolean {
  const targetNodeId = edge.target.nodeId;
  const targetGroupName = getInterfaceGroupName(edge.source.nodeId, edge.target.nodeId);
  const targetGroup = interfaceGroupPositions[targetGroupName];
  return targetNodeId === selectedNodeName && !!targetGroup?.interfaces.find((i) => i.id === edge.source.interface);
}

export function getNameFromNode(node: GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | null): string | null {
  if (node == null) {
    return null;
  }
  if ('device' in node) {
    if (!node.device) {
      return node.name;
    }
    return node.device.name;
  }
  return node.name;
}

export function ensureNodeHasDevice(
  value: GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | null,
): value is GraphNode {
  return value != null && 'device' in value;
}

export const isGmPathPredicate = (gmPath: string[], edge: GraphEdgeWithDiff): boolean => {
  const fromInterfaceIndex = gmPath.findIndex((deviceInterface) => deviceInterface === edge.source.interface);
  if (fromInterfaceIndex === -1) {
    return false;
  }
  return gmPath.includes(edge.target.interface, fromInterfaceIndex);
};

// we flatten interface data to be able to use them in info panel
export function normalizeNodeInterfaceData<
  T extends { id: string; status: string; name: string; details: Record<string, unknown> | null },
>(nodeInterface: T): Record<string, boolean | string | number | null> {
  const { id, status, name, details } = nodeInterface;

  return {
    id,
    status,
    name,
    ...details,
  };
}
