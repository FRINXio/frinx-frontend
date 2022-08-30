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

export function getDefaultNodesPositions(nodes: { id: string; device: Device }[]): Record<string, Position> {
  return nodes.reduce((acc, curr) => {
    const { device } = curr;
    const { position } = device;
    return {
      ...acc,
      [curr.device.name]: { x: position?.x ?? getRandomInt(1000), y: position?.y ?? getRandomInt(600) },
    };
  }, {} as Record<string, Position>);
}
