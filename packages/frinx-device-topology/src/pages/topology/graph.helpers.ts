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
  TOP_LEFT: [-20, -20],
  TOP_CENTER: [0, -20],
  TOP_RIGHT: [20, -20],
  CENTER_RIGHT: [20, 0],
  BOTTOM_RIGHT: [20, 20],
  BOTTOM_CENTER: [0, 20],
  BOTTOM_LEFT: [-20, 20],
  CENTER_LEFT: [-20, 0],
};

export type PositionsMap = {
  nodes: Record<string, Position>;
  interfaces: Record<string, Position>;
};

export function getDefaultNodesPositions(nodes: GraphNode[]): PositionsMap {
  const nodesMap = nodes.reduce((acc, curr) => {
    const { device } = curr;
    const { position } = device;
    return {
      ...acc,
      [curr.device.name]: { x: position?.x ?? getRandomInt(1000), y: position?.y ?? getRandomInt(600) },
    };
  }, {} as Record<string, Position>);
  const interfacesMap = nodes
    .map((n) => n.interfaces)
    .flat()
    .reduce((acc, curr) => {
      const node = unwrap(nodes.find((n) => n.interfaces.includes(curr)));
      const index = node.interfaces.findIndex((n) => n === curr);
      const position = nodesMap[node.device.name];
      const [offsetX, offsetY] = POSITIONS_MAP[POSITIONS[index]];
      return {
        ...acc,
        [curr]: { x: position.x + offsetX, y: position.y + offsetY },
      };
    }, {} as Record<string, Position>);
  return {
    nodes: nodesMap,
    interfaces: interfacesMap,
  };
}

export function getUpdatedInterfacesPositions(node: GraphNode, position: Position): Record<string, Position> {
  const { interfaces } = node;
  return interfaces.reduce((acc, curr, index) => {
    const [offsetX, offsetY] = POSITIONS_MAP[POSITIONS[index]];
    return {
      ...acc,
      [curr]: { x: position.x + offsetX, y: position.y + offsetY },
    };
  }, {});
}
