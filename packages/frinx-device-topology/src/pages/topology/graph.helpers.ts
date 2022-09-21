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

export const NODE_CIRCLE_RADIUS = 30;

export type PositionsMap = {
  nodes: Record<string, Position>;
  interfaces: Record<string, Position>;
};

export function getAngleBetweenPoints(p1: Position, p2: Position): number {
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
    const target =
      edges.find((e) => e.source.interface === curr)?.target ?? edges.find((e) => e.target.interface === curr)?.source;

    // if interface does not have defined connections, we will not display it
    // because we cannot count angle to properly display it
    // we should be able to display info about not connected interface somewhere in UI
    // for example when you click on particular node
    if (!target) {
      const node = unwrap(nodes.find((n) => n.interfaces.includes(curr)));
      const x = 0;
      const y = NODE_CIRCLE_RADIUS;
      return {
        ...acc,
        [curr]: { x: positionMap[node.device.name].x + x, y: positionMap[node.device.name].y + y },
      };
    }
    const sourceNode = unwrap(nodes.find((n) => n.interfaces.includes(curr)));
    const targetNode = unwrap(nodes.find((n) => n.interfaces.includes(target.interface)));
    const pos1 = positionMap[sourceNode.device.name];
    const pos2 = positionMap[targetNode.device.name];
    const angle = getAngleBetweenPoints(pos1, pos2);
    const y = NODE_CIRCLE_RADIUS * Math.sin(angle);
    const x = NODE_CIRCLE_RADIUS * Math.cos(angle);
    return {
      ...acc,
      [curr]: { x: pos1.x + x, y: pos1.y + y },
    };
  }, {});
}

const POSITIONS_CACHE = new Map<string, Position>();

function setCachedNodePosition(nodeId: string, position?: Position): void {
  if (POSITIONS_CACHE.get(nodeId) == null) {
    POSITIONS_CACHE.set(nodeId, position ?? { x: getRandomInt(1000), y: getRandomInt(600) });
  }
}

function getCachedNodePosition(nodeId: string): Position {
  return unwrap(POSITIONS_CACHE.get(nodeId));
}

export function getDefaultPositionsMap(nodes: GraphNode[], edges: GraphEdge[]): PositionsMap {
  const nodesMap = nodes.reduce((acc, curr) => {
    const { device } = curr;
    const { position } = device;
    setCachedNodePosition(device.name);
    return {
      ...acc,
      [device.name]: position ?? getCachedNodePosition(device.name),
    };
  }, {} as Record<string, Position>);
  return {
    nodes: nodesMap,
    interfaces: getInterfacesPositions({ nodes, edges, positionMap: nodesMap }),
  };
}
