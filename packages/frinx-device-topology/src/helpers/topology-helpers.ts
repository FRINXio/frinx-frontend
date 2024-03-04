import { v4 as uuid } from 'uuid';
import differenceBy from 'lodash/differenceBy';
import { BackupGraphNode, GraphEdge, GraphNode } from '../pages/topology/graph.helpers';

export type Change = 'ADDED' | 'DELETED' | 'UPDATED' | 'NONE';

export type GraphNodeWithDiff = GraphNode & {
  change: Change;
};

export type GraphEdgeWithDiff = GraphEdge & {
  change: Change;
};

export function getNodesWithDiff(nodes: GraphNode[], backupGraphNodes: BackupGraphNode[]): GraphNodeWithDiff[] {
  if (backupGraphNodes.length === 0) {
    return nodes.map((n) => ({
      ...n,
      change: 'NONE' as const,
    }));
  }
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));
  const backupNodesMap = new Map(backupGraphNodes.map((n) => [n.id, n]));
  const currentNodesWithDiff = nodes.map((n) => {
    const { id, interfaces } = n;
    const addedInterfaces = differenceBy(
      nodesMap.get(id)?.interfaces ?? [],
      backupNodesMap.get(id)?.interfaces ?? [],
      'id',
    ).map((i) => ({ ...i, change: 'ADDED' }));
    const removedInterfaces = differenceBy(
      backupNodesMap.get(id)?.interfaces,
      nodesMap.get(id)?.interfaces ?? [],
      'id',
    ).map((i) => ({ ...i, change: 'DELETED' }));
    const noChangeInterfaces = differenceBy(interfaces, removedInterfaces, addedInterfaces, 'id').map((i) => ({
      ...i,
      change: 'NONE',
    }));
    if (backupNodesMap.has(n.id)) {
      return {
        ...n,
        interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces],
        change: 'NONE' as const,
      };
    }
    return {
      ...n,
      interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces],
      change: 'ADDED' as const,
    };
  });

  const deletedBackupNodesWithDiff = backupGraphNodes
    .map((n) => {
      const { id, name, interfaces, coordinates } = n;
      return {
        id,
        name,
        device: {
          id: uuid(),
          deviceSize: 'MEDIUM' as const,
          name,
          // below are some fake data
          isInstalled: false,
          createdAt: '1970-01-01',
          serviceState: 'PLANNING',
        },
        deviceType: null,
        softwareVersion: null,
        interfaces,
        coordinates,
        change: 'DELETED' as const,
      };
    })
    .filter((n) => !nodesMap.has(n.id));

  return [...currentNodesWithDiff, ...deletedBackupNodesWithDiff];
}

export function getEdgesWithDiff(edges: GraphEdge[], backupEdges: GraphEdge[]): GraphEdgeWithDiff[] {
  if (backupEdges.length === 0) {
    return edges.map((e) => ({
      ...e,
      change: 'NONE' as const,
    }));
  }
  const edgesMap = new Map(edges.map((e) => [e.id, e]));
  const backupEdgesMap = new Map(backupEdges.map((e) => [e.id, e]));
  const currentEdgesWithDiff = edges.map((e) => {
    if (backupEdgesMap.has(e.id)) {
      return {
        ...e,
        change: 'NONE' as const,
      };
    }
    return {
      ...e,
      change: 'ADDED' as const,
    };
  });

  const deletedBackupEdgesWithDiff = backupEdges
    .filter((e) => !edgesMap.has(e.id))
    .map((e) => {
      return {
        ...e,
        change: 'DELETED' as const,
      };
    });
  return [...currentEdgesWithDiff, ...deletedBackupEdgesWithDiff];
}

// we count number of device gm path response excluding device itself
export function getGmPathHopsCount(gmPathIds: string[], devicePrefix: 'PtpDevice' | 'SynceDevice'): number {
  return gmPathIds.filter((id) => id.startsWith(devicePrefix)).length - 1;
}
