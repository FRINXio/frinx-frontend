import * as yup from 'yup';
import { SelectPoolsQuery, SelectResourceTypesQuery } from '../__generated__/graphql';

const IPV4_REGEX = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;
const IPV6_REGEX =
  /(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/;

export type AvailableAllocatedResource = { Name: string; id: string; parentId: string; hasNestedPools: boolean };

export function getAvailableAllocatedResources(
  pools: SelectPoolsQuery['QueryResourcePools'],
  parentPoolId?: string,
): AvailableAllocatedResource[] {
  return pools.flatMap((resourcePool) =>
    resourcePool.Resources.map((resource) => ({
      Name: `${resource.Properties[Object.keys(resource.Properties)[0]]}`,
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

export const isSpecificResourceTypeName = (resourceTypeName: string, selectors: string[]) => {
  return selectors.some((selector) => selector === resourceTypeName);
};

export const canSelectDefaultResourceTypes = (resourceTypeName: string) => {
  return isSpecificResourceTypeName(resourceTypeName, [
    'ipv4',
    'ipv4_prefix',
    'ipv6',
    'ipv6_prefix',
    'vlan_range',
    'vlan',
    'route_distinguisher',
    'unique_id',
    'random_signed_int32',
  ]);
};

export const canSelectIpResourceTypes = (resourceTypeName: string) => {
  return isSpecificResourceTypeName(resourceTypeName, ['ipv4', 'ipv4_prefix', 'ipv6', 'ipv6_prefix']);
};

export const isCustomResourceType = (resourceTypename: string) => {
  return !isSpecificResourceTypeName(resourceTypename, [
    'ipv4',
    'ipv4_prefix',
    'ipv6',
    'ipv6_prefix',
    'vlan_range',
    'vlan',
    'route_distinguisher',
    'unique_id',
    'random_signed_int32',
  ]);
};

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
  values?: Record<string, string | number>,
): [poolProperties: Record<string, string | number>, poolValues: Record<string, 'int' | 'string' | 'bool'>] {
  const resourceTypeName = resourceTypes.find((type) => type.id === resourceTypeId)?.Name;
  let result: [poolProperties: Record<string, string | number>, poolValues: Record<string, 'int' | 'string' | 'bool'>] =
    [{}, {}];

  switch (resourceTypeName) {
    case 'ipv4':
    case 'ipv6':
    case 'ipv6_prefix':
    case 'ipv4_prefix':
      result = [
        { address: values?.address || '', prefix: values?.prefix || '', subnet: values?.subnet || 'false' },
        { address: 'string', prefix: 'int', subnet: 'bool' },
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

function getSchemaForPoolValues(
  poolValues: Record<string, string>[],
  options: { isIpv6?: boolean; isIpv4?: boolean } = { isIpv4: false, isIpv6: false },
) {
  return yup.array().of(
    yup.object().shape({
      ...Object.keys(poolValues[0] ?? {}).reduce((acc, key) => {
        if (key === 'address') {
          return {
            ...acc,
            [key]: yup
              .string()
              .matches(
                options.isIpv4 ? IPV4_REGEX : IPV6_REGEX,
                `Please enter a valid ${options.isIpv4 ? 'IPv4' : 'IPv6'} address`,
              )
              .required(`Please enter an ${options.isIpv4 ? 'IPv4' : 'IPv6'} address`),
          };
        } else {
          return {
            ...acc,
            [key]: yup.string().required('Please enter a value'),
          };
        }
      }, {}),
    }),
  );
}

export function getSchemaForCreatePoolForm(poolType: string, isNested: boolean) {
  switch (poolType) {
    case 'allocating':
      return yup.object({
        name: yup.string().required('Please enter a name'),
        description: yup.string().notRequired(),
        resourceTypeId: yup.string().required('Please enter resource type'),
        tags: yup.array().notRequired(),
        dealocationSafetyPeriod: yup
          .number()
          .min(0, 'Please enter positive number')
          .required('Please enter a dealocation safety period')
          .typeError('Please enter a number'),
        allocationStrategyId: yup.string().notRequired(),
        poolProperties: yup.lazy((poolProperties) =>
          yup
            .object()
            .when('resourceTypeName', {
              is: (resourceTypeName: string) =>
                isSpecificResourceTypeName(resourceTypeName, [
                  'ipv4',
                  'ipv4_prefix',
                  'vlan',
                  'vlan_range',
                  'unique_id',
                ]),
              then: yup.object().shape({
                ...Object.keys(poolProperties).reduce((acc, key) => {
                  if (key === 'id') {
                    return {
                      ...acc,
                      [key]: yup
                        .number()
                        .min(1, 'Minimal required value is 1')
                        .typeError('Please enter a number')
                        .required(`Please enter a value`),
                    };
                  }

                  if (key === 'from') {
                    return {
                      ...acc,
                      [key]: yup
                        .number()
                        .min(0, 'Minimal required value is 0')
                        .max(4095, 'Maximal allowed value is 4095')
                        .lessThan(poolProperties.to, 'FROM value must be less than TO value')
                        .typeError('Please enter a number')
                        .required(`Please enter a value`),
                    };
                  }

                  if (key === 'to') {
                    return {
                      ...acc,
                      [key]: yup
                        .number()
                        .min(0, 'Minimal required value is 0')
                        .max(4095, 'Maximal allowed value is 4095')
                        .moreThan(poolProperties.from, 'TO value must be greater than FROM value')
                        .typeError('Please enter a number')
                        .required(`Please enter a value`),
                    };
                  }

                  if (key === 'prefix') {
                    return {
                      ...acc,
                      [key]: yup
                        .number()
                        .min(1, 'Minimal required value is 1')
                        .max(32, 'Maximal allowed value is 32')
                        .typeError('Please enter a number')
                        .required(`Please enter a value`),
                    };
                  }

                  if (key === 'address') {
                    return {
                      ...acc,
                      [key]: yup
                        .string()
                        .matches(IPV4_REGEX, `Please enter a valid IPv4 address`)
                        .required(`Please enter an IPv4 address`),
                    };
                  }

                  return {
                    ...acc,
                    [key]: yup.string().required('Please enter a value'),
                  };
                }, {}),
              }),
            })
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'ipv6' || resourceTypeName === 'ipv6_prefix',
              then: yup.object().shape({
                ...Object.keys(poolProperties).reduce((acc, key) => {
                  if (key === 'address') {
                    return {
                      ...acc,
                      [key]: yup
                        .string()
                        .matches(IPV6_REGEX, `Please enter a valid IPv6 address`)
                        .required(`Please enter an IPv6 address`),
                    };
                  }

                  if (key === 'prefix') {
                    return {
                      ...acc,
                      [key]: yup
                        .number()
                        .min(1, 'Minimal required value is 1')
                        .max(128, 'Maximal allowed value is 128')
                        .typeError('Please enter a number')
                        .required(`Please enter a value`),
                    };
                  }

                  return {
                    ...acc,
                    [key]: yup.string(),
                  };
                }, {}),
              }),
            })
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => isCustomResourceType(resourceTypeName) && resourceTypeName != null,
              then: yup.object().shape({
                ...Object.keys(poolProperties).reduce((acc, key) => {
                  return {
                    ...acc,
                    [key]: yup.string().required('This field is required'),
                  };
                }, {}),
              }),
            })
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'random_signed_int32',
              then: yup.object().shape({
                ...Object.keys(poolProperties).reduce((acc, key) => {
                  return {
                    ...acc,
                    [key]: yup
                      .number()
                      .typeError('Please enter a number')
                      .min(-2147483648, 'Please enter a number between -2147483648 and 2147483647')
                      .max(2147483647, 'Please enter a number between -2147483648 and 2147483647')
                      .required('Please enter a value'),
                  };
                }, {}),
              }),
            }),
        ),
        poolPropertyTypes: yup.object().required(),
        ...(isNested && {
          parentPoolId: yup.string().required('Please choose parent pool'),
          parentResourceId: yup.string().required('Please choose allocated resource from parent'),
        }),
      });

    case 'set':
      return yup.object({
        name: yup.string().required('Please enter a name'),
        description: yup.string().notRequired(),
        resourceTypeId: yup.string().required('Please enter resource type'),
        tags: yup.array().of(yup.string()).notRequired(),
        dealocationSafetyPeriod: yup
          .number()
          .min(0, 'Please enter positive number')
          .required('Please enter a dealocation safety period')
          .typeError('Please enter a number'),
        poolValues: yup.lazy((poolValues: Array<Record<string, string>>) => {
          return yup
            .array()
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'ipv4' || resourceTypeName === 'ipv4_prefix',
              then: getSchemaForPoolValues(poolValues, { isIpv4: true }),
            })
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'ipv6' || resourceTypeName === 'ipv6_prefix',
              then: getSchemaForPoolValues(poolValues, { isIpv6: true }),
              otherwise: yup.array().of(
                yup.object().shape({
                  ...Object.keys(poolValues[0] ?? {}).reduce(
                    (acc, key) => ({ ...acc, [key]: yup.string().required('Please enter a value') }),
                    {},
                  ),
                }),
              ),
            })
            .min(1, 'Please enter at least one value');
        }),
        ...(isNested && {
          parentPoolId: yup.string().required('Please choose parent pool'),
          parentResourceId: yup.string().required('Please choose allocated resource from parent'),
        }),
      });

    default:
      return yup.object({
        name: yup.string().required('Please enter a name'),
        description: yup.string().notRequired(),
        tags: yup.array(),
        resourceTypeId: yup.string().required('Please enter resource type'),
        ...(isNested && {
          parentPoolId: yup.string().required('Please choose parent pool'),
          parentResourceId: yup.string().required('Please choose allocated resource from parent'),
        }),
      });
  }
}
