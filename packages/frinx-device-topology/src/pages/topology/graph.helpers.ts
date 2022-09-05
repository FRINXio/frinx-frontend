import { unwrap } from '@frinx/shared';

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export type Position = {
  x: number;
  y: number;
};

export type Device = {
  id: string;
  name: string;
  position: Position | null;
};

export type GraphNode = {
  id: string;
  device: Device;
  interfaces: string[];
};

export type SourceTarget = {
  nodeId: string;
  interface: string;
};
export type GraphEdge = {
  id: string;
  source: SourceTarget;
  target: SourceTarget;
};

export const POSITIONS = [
  'TOP_LEFT' as const,
  'TOP_CENTER' as const,
  'TOP_RIGHT' as const,
  'CENTER_RIGHT' as const,
  'BOTTOM_RIGHT' as const,
  'BOTTOM_CENTER' as const,
  'BOTTOM_LEFT' as const,
  'CENTER_LEFT' as const,
];

export const POSITIONS_MAP = {
  TOP_LEFT: [-30, -30],
  TOP_CENTER: [0, -30],
  TOP_RIGHT: [30, -30],
  CENTER_RIGHT: [30, 0],
  BOTTOM_RIGHT: [30, 30],
  BOTTOM_CENTER: [0, 30],
  BOTTOM_LEFT: [-30, 30],
  CENTER_LEFT: [-30, 0],
};

const SIDE_LENGHT = 30;

export type PositionsMap = {
  nodes: Record<string, Position>;
  interfaces: Record<string, Position>;
};

function getAngleBetweenPoints(p1: Position, p2: Position): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export type UpdateInterfacePositionParams = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  positionMap: Record<string, Position>;
};

export function getInterfacesPositions({ nodes, edges, positionMap }: UpdateInterfacePositionParams) {
  const allInterfaces = nodes.map((n) => n.interfaces).flat();
  return allInterfaces.reduce((acc, curr) => {
    const target = unwrap(
      edges.find((e) => e.source.interface === curr)?.target ?? edges.find((e) => e.target.interface === curr)?.source,
    );
    const sourceNode = unwrap(nodes.find((n) => n.interfaces.includes(curr)));
    const targetNode = unwrap(nodes.find((n) => n.interfaces.includes(target.interface)));
    const pos1 = positionMap[sourceNode.device.name];
    const pos2 = positionMap[targetNode.device.name];
    const angle = getAngleBetweenPoints(pos1, pos2);
    const y = SIDE_LENGHT * Math.sin(angle);
    const x = SIDE_LENGHT * Math.cos(angle);
    return {
      ...acc,
      [curr]: { x: pos1.x + x, y: pos1.y + y },
    };
  }, {});
}

export function getDefaultNodesPositions(nodes: GraphNode[], edges: GraphEdge[]): PositionsMap {
  const nodesMap = nodes.reduce((acc, curr) => {
    const { device } = curr;
    const { position } = device;
    return {
      ...acc,
      [device.name]: { x: position?.x ?? getRandomInt(1000), y: position?.y ?? getRandomInt(600) },
    };
  }, {} as Record<string, Position>);
  return {
    nodes: nodesMap,
    interfaces: getInterfacesPositions({ nodes, edges, positionMap: nodesMap }),
  };
}
