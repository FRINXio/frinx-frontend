import { v4 as uuid } from 'uuid';
import { GraphNode, BackupGraphNode, getRandomInt } from '../pages/topology/graph.helpers';

export type Change = 'ADDED' | 'DELETED' | 'UPDATED' | 'NONE';

export type GraphNodeWithDiff = GraphNode & {
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
