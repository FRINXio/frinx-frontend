import { SelectPoolsQuery, SelectResourceTypesQuery } from '../__generated__/graphql';

export function getAvailableAllocatedResources(
  pools: SelectPoolsQuery['QueryResourcePools'],
  parentPoolId?: string,
): { Name: string; id: string; parentId: string; hasNestedPools: boolean }[] {
  return pools.flatMap((resourcePool) =>
    resourcePool.Resources.map((resource) => ({
      Name: `${resource.Description}`,
      id: resource.id,
      parentId: resource.ParentPool.id,
      hasNestedPools: resource.NestedPool !== null,
    })).filter(({ parentId, hasNestedPools }) => parentId === parentPoolId && hasNestedPools === false),
  );
}

export function getAvailableResourceTypes(
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'],
  pools: SelectPoolsQuery['QueryResourcePools'],
  parentPoolId?: string,
): SelectResourceTypesQuery['QueryResourceTypes'] {
  return parentPoolId
    ? resourceTypes.filter(
        (resourceType) => resourceType.id === pools.find((pool) => pool.id === parentPoolId)?.ResourceType.id,
      )
    : resourceTypes;
}

export function deriveResourceTypesFromAvailableResourceTypes(
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'],
  availableResourceTypes: SelectResourceTypesQuery['QueryResourceTypes'],
): SelectResourceTypesQuery['QueryResourceTypes'] {
  return resourceTypes.filter(
    (resourceType) =>
      resourceTypes.length !== availableResourceTypes.length &&
      ((availableResourceTypes.find((type) => type.Name === 'ipv4_prefix') && resourceType.Name === 'ipv4') ||
        (availableResourceTypes.find((type) => type.Name === 'ipv6_prefix') && resourceType.Name === 'ipv6')),
  );
}

export function canSelectAllocatingStrategy(
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'],
  resourceTypeId?: string,
): boolean {
  return resourceTypes.some(
    (resourceType) =>
      /^ipv4_prefix$|^ipv6_prefix$|^vlan_range$/.test(resourceType.Name) && resourceType.id === resourceTypeId,
  );
}

export function getAvailablePoolProperties(
  resourcePools: SelectPoolsQuery,
  parentPoolId?: string,
  parentResourceId?: string,
): Record<string, string>[] | undefined {
  return resourcePools.QueryResourcePools.flatMap((resourcePool) => {
    return {
      id: resourcePool.id,
      resources: resourcePool.Resources.map((resource) => ({
        id: resource.id,
        properties: resource.Properties,
      })),
    };
  })
    .filter(({ id }) => id === parentPoolId)
    .flatMap(({ resources }) => resources.find((resource) => resource.id === parentResourceId)?.properties);
}

export function formatSuggestedProperties(
  selectedResourceType: string | null,
  properties?: Record<string, string>[],
): string[] {
  switch (selectedResourceType) {
    case 'ipv4':
      return properties?.map((property) => `address: ${property?.address || ''}`) ?? [];
    case 'ipv6':
      return properties?.map((property) => `address: ${property?.address || ''}`) ?? [];
    case 'vlan_range':
      return properties?.map((property) => `from: ${property?.from || ''}, to: ${property?.to || ''}`) ?? [];
    case 'ipv4_prefix':
      return (
        properties?.map((property) => `address: ${property?.address || ''}, prefix: ${property?.prefix || ''}`) ?? []
      );
    case 'ipv6_prefix':
      return (
        properties?.map((property) => `address: ${property?.address || ''}, prefix: ${property?.prefix || ''}`) ?? []
      );
    case 'vlan':
      return properties?.map((property) => `vlan: ${property?.vlan || ''}`) ?? [];
    case 'random_signed_int32':
      return properties?.map((property) => `int: ${property?.int || ''}`) ?? [];
    case 'route_distinguisher':
      return properties?.map((property) => `rd: ${property?.rd || ''}`) ?? [];
    case 'unique_id':
      return properties?.map((property) => `id: ${property?.id || ''}`) ?? [];
    default:
      return [''];
  }
}

export function getPoolPropertiesSkeleton(
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'],
  resourceTypeId: string,
  values?: Record<string, string>,
): [poolProperties: Record<string, string>, poolValues: Record<string, 'int' | 'string'>] {
  const resourceTypeName = resourceTypes.find((type) => type.id === resourceTypeId)?.Name;
  let result: [poolProperties: Record<string, string>, poolValues: Record<string, 'int' | 'string'>] = [{}, {}];

  switch (resourceTypeName) {
    case 'ipv4':
    case 'ipv6':
    case 'ipv6_prefix':
    case 'ipv4_prefix':
      result = [
        { address: values?.address || '', prefix: values?.prefix || '' },
        { address: 'string', prefix: 'int' },
      ];
      break;
    case 'route_distinguisher':
      result = [{ rd: values?.rd || '' }, { rd: 'string' }];
      break;
    case 'random_signed_int32':
    case 'vlan':
    case 'vlan_range':
      result = [
        { from: values?.from || '', to: values?.to || '' },
        { from: 'int', to: 'int' },
      ];
      break;
    case 'unique_id':
      result = [
        { from: values?.from || '', to: values?.to || '', idFormat: '{counter}' },
        { from: 'int', to: 'int', idFormat: 'string' },
      ];
      break;
    default:
      break;
  }

  return result;
}
