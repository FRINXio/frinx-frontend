import { PoolCapacityPayload } from '../__generated__/graphql';

export function getTotalCapacity(capacity: PoolCapacityPayload | null): bigint {
  if (capacity == null) {
    return 0n;
  }
  return BigInt(Number(capacity.freeCapacity)) + BigInt(Number(capacity.utilizedCapacity));
}
