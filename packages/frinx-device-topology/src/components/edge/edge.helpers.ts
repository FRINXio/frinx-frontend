import { Change, GraphEdgeWithDiff } from '../../helpers/topology-helpers';
import { GraphNetNode, height, width } from '../../pages/topology/graph.helpers';

export function getEdgeColor(change: Change, isUnknown: boolean, isShortestPath: boolean, isGmpath: boolean): string {
  if (isShortestPath) {
    return 'blue.400';
  }
  if (isGmpath) {
    return 'red.400';
  }
  if (isUnknown) {
    if (change === 'DELETED') {
      return 'red.200';
    }
    if (change === 'ADDED') {
      return 'green.200';
    }
    if (change === 'UPDATED') {
      return 'yellow.200';
    }
    return 'gray.200';
  }
  if (change === 'DELETED') {
    return 'red.400';
  }
  if (change === 'ADDED') {
    return 'green.400';
  }
  if (change === 'UPDATED') {
    return 'yellow.400';
  }
  return 'gray.800';
}

export function findCommonNetSubnet(netNodes: GraphNetNode[], edge: GraphEdgeWithDiff) {
  const netNodeSource = (netNodes || []).filter((node: GraphNetNode) => node.name === edge.source.nodeId)[0];
  const netNodeTarget = (netNodes || []).filter((node: GraphNetNode) => node.name === edge.target.nodeId)[0];

  const commonSubnet = (netNodeSource?.networks || []).find((sourceNode) =>
    netNodeTarget?.networks.some((targetNetwork) => targetNetwork.subnet === sourceNode.subnet),
  );
  return commonSubnet ? commonSubnet.subnet : null;
}

export function getNetSubnetCoordinates(netNodes: GraphNetNode[], edge: GraphEdgeWithDiff) {
  const sourceCoordX = netNodes.filter((node: GraphNetNode) => node.name === edge.source.nodeId)[0]?.coordinates.x;
  const sourceCoordY = netNodes.filter((node: GraphNetNode) => node.name === edge.source.nodeId)[0]?.coordinates.y;
  const targetCoordX = netNodes.filter((node: GraphNetNode) => node.name === edge.target.nodeId)[0]?.coordinates.x;
  const targetCoordY = netNodes.filter((node: GraphNetNode) => node.name === edge.target.nodeId)[0]?.coordinates.y;
  const x = ((sourceCoordX + targetCoordX) / 2) * width;
  const y = ((sourceCoordY + targetCoordY) / 2) * height;

  return {
    x,
    y,
  };
}
