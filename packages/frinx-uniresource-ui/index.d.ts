import { FC } from 'react';

declare module '@frinx/uniresource-ui' {
  export const ResourceTypes: FC;
  export const Pools: FC<{ onDetailClick: (id: string) => void }>;
  export const ResourceList;
  export const PoolDetailPage: FC<{ id: string; onBreadcrumbLinkClick: (routeId: string) => void }>;
  export const AllocationStrategies: FC;
  export const ResourceManagerStateWrapper: FC;
}
