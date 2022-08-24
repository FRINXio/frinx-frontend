function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export type Position = {
  x: number;
  y: number;
};

export function getDefaultNodesPositions(nodes: { id: string; device: { name: string } }[]): Record<string, Position> {
  return nodes.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.device.name]: { x: getRandomInt(1000), y: getRandomInt(600) },
    };
  }, {} as Record<string, Position>);
}
