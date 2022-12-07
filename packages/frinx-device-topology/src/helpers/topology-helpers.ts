import { v4 as uuid } from 'uuid';
import { GraphNode, BackupGraphNode, GraphEdge, getRandomInt } from '../pages/topology/graph.helpers';

export type Change = 'ADDED' | 'DELETED' | 'UPDATED' | 'NONE';

export type GraphNodeWithDiff = GraphNode & {
  change: Change;
};

export type GraphEdgeWithDiff = GraphEdge & {
  change: Change;
};

export function getNodesWithDiff(nodes: GraphNode[], backupGraphNodes: BackupGraphNode[]): GraphNodeWithDiff[] {
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));
  const backupNodesMap = new Map(backupGraphNodes.map((n) => [n.id, n]));
  const currentNodesWithDiff = nodes.map((n) => {
    if (backupNodesMap.has(n.id)) {
      return {
        ...n,
        change: 'NONE' as Change,
      };
    } else {
      return {
        ...n,
        change: 'ADDED' as Change,
      };
    }
  });

  const deletedBackupNodesWithDiff: GraphNodeWithDiff[] = backupGraphNodes
    .filter((n) => !nodesMap.has(n.id))
    .map((n) => {
      const { id, name, interfaces } = n;
      return {
        id,
        device: {
          id: uuid(),
          deviceSize: 'MEDIUM',
          name,
          position: { x: getRandomInt(1000), y: getRandomInt(600) },
        },
        interfaces,
        change: 'DELETED' as Change,
      };
    });

  return [...currentNodesWithDiff, ...deletedBackupNodesWithDiff];
}

export function getEdgesWithDiff(edges: GraphEdge[], backupEdges: GraphEdge[]): GraphEdgeWithDiff[] {
  const edgesMap = new Map(edges.map((e) => [e.id, e]));
  const backupEdgesMap = new Map(edges.map((e) => [e.id, e]));
  const currentEdgesWithDiff = edges.map((e) => {
    if (backupEdgesMap.has(e.id)) {
      return {
        ...e,
        change: 'NONE' as Change,
      };
    } else {
      return {
        ...e,
        change: 'ADDED' as Change,
      };
    }
  });

  const deletedBackupEdgesWithDiff = backupEdges
    .filter((e) => !edgesMap.has(e.id))
    .map((e) => {
      return {
        ...e,
        change: 'DELETED' as Change,
      };
    });
  return [...currentEdgesWithDiff, ...deletedBackupEdgesWithDiff];
}
