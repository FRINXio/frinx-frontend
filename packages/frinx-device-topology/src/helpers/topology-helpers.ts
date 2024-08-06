import { v4 as uuid } from 'uuid';
import differenceBy from 'lodash/differenceBy';
import { LatLngTuple } from 'leaflet';
import {
  BackupGraphNode,
  BackupNetGraphNode,
  GraphEdge,
  GraphNode,
  SynceGraphNode,
  PtpGraphNode,
} from '../pages/topology/graph.helpers';
import { NetNode, PtpDeviceDetails, SynceDeviceDetails } from '../__generated__/graphql';

// TODO make these 2 constants env. variables
export const DEFAULT_MAP_CENTER: LatLngTuple = [48.15247287355192, 17.12495675052697]; // Bratislava
export const DEFAULT_MAP_ZOOM_LEVEL = 10;

export type Change = 'ADDED' | 'DELETED' | 'UPDATED' | 'NONE';

export type GraphNodeWithDiff = GraphNode & {
  change: Change;
};

export type PtpGraphNodeWithDiff = PtpGraphNode & {
  change: Change;
};

export type SynceGraphNodeWithDiff = SynceGraphNode & {
  change: Change;
};

export type NetGraphNodeWithDiff = NetNode & {
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

export function getPtpNodesWithDiff(
  nodes: PtpGraphNode[],
  backupGraphNodes: BackupGraphNode[],
): PtpGraphNodeWithDiff[] {
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
        interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
          ...i,
          details: null,
        })),
        change: 'NONE' as const,
      };
    }
    return {
      ...n,
      interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
        ...i,
        details: null,
      })),
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
        details: {} as PtpDeviceDetails,
        interfaces: interfaces.map((i) => ({ ...i, details: null })),
        coordinates,
        change: 'DELETED' as const,
        status: 'ok' as const,
        labels: [],
        nodeId: '',
      };
    })
    .filter((n) => !nodesMap.has(n.id));

  return [...currentNodesWithDiff, ...deletedBackupNodesWithDiff];
}

export function getSynceInterfaceNodeColor(
  isQualifiedForUse?: string | null,
  selectedForUse?: string | null,
  synceEnabled?: boolean,
) {
  if (!synceEnabled) {
    return 'black';
  }
  if (synceEnabled && isQualifiedForUse === 'unknown') {
    return 'red';
  }
  if (synceEnabled && isQualifiedForUse === 'Yes' && !selectedForUse) {
    return 'blue';
  }
  if (synceEnabled && isQualifiedForUse) {
    return 'green';
  }
  return 'purple';
}

export function getSynceNodesWithDiff(
  nodes: SynceGraphNode[],
  backupGraphNodes: BackupGraphNode[],
): SynceGraphNodeWithDiff[] {
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
        interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
          ...i,
          details: null,
        })),
        change: 'NONE' as const,
      };
    }
    return {
      ...n,
      interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
        ...i,
        details: null,
      })),
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
        details: {} as SynceDeviceDetails,
        interfaces: interfaces.map((i) => ({ ...i, details: null })),
        coordinates,
        change: 'DELETED' as const,
        status: 'ok' as const,
        labels: [],
        nodeId: '',
      };
    })
    .filter((n) => !nodesMap.has(n.id));

  return [...currentNodesWithDiff, ...deletedBackupNodesWithDiff];
}

export function getNetNodesWithDiff(nodes: NetNode[], backupGraphNodes: BackupNetGraphNode[]): NetGraphNodeWithDiff[] {
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
        interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
          ...i,
          details: null,
        })),
        change: 'NONE' as const,
      };
    }
    const node = {
      ...n,
      interfaces: [...addedInterfaces, ...removedInterfaces, ...noChangeInterfaces].map((i) => ({
        ...i,
        details: null,
      })),
      change: 'ADDED' as const,
    };
    return node;
  });

  const deletedBackupNodesWithDiff = backupGraphNodes
    .map((n) => {
      const { id, name, interfaces, coordinates, networks } = n;
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
        interfaces: interfaces.map((i) => ({ ...i, details: null })),
        networks,
        coordinates,
        change: 'DELETED' as const,
        status: 'ok' as const,
        labels: [],
        nodeId: '',
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

// ptp profile should be same all over the ptp nodes,
// so we grab that info from the first one
export function getPtpProfile(ptpNodes: PtpGraphNode[]): string | null {
  return ptpNodes.at(0)?.details.ptpProfile ?? null;
}
