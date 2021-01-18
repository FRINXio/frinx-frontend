// @flow

export type Tag = {
  id: string,
  Tag: string,
};

export type Capacity = {
  utilizedCapacity: number,
  freeCapacity: number,
};

export type Pool = {
  id: string,
  Name: string,
  PoolType: string,
  Tags: Tag[],
  AllocationStrategy: ?{ id: string, Name: string },
  ResourceType: ?{ id: string, Name: string },
  Capacity: ?Capacity,
};
