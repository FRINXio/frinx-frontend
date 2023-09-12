import { describe, expect, test, assert } from 'vitest';
import { readFileSync } from 'fs';
import {
  getAvailableAllocatedResources,
  getAvailableResourceTypes,
  deriveResourceTypesFromAvailableResourceTypes,
  isSpecificResourceTypeName,
  canSelectIpResourceTypes,
  isCustomResourceType,
  getAvailablePoolProperties,
  formatSuggestedProperties,
  getPoolPropertiesSkeleton,
  getSchemaForCreatePoolForm,
} from './create-pool-form.helpers';

function loadPool(fileName: string) {
  return JSON.parse(readFileSync(`./packages/frinx-resource-manager/src/helpers/pools/${fileName}`).toString());
}

describe('create pools form helpers', () => {
  test('getAvailableAllocatedResources', () => {
    const resourcePoolId = '21474836507';
    const resourcePool = loadPool(`get-available-allocated-resources/get-available-allocated-resources-input.json`);
    const availableAllocatedResourcesOutput = loadPool(
      `get-available-allocated-resources/get-available-allocated-resources-output.json`,
    );

    expect(getAvailableAllocatedResources(resourcePool, resourcePoolId)).toEqual(availableAllocatedResourcesOutput);
  });
  test('getAvailableResourceTypes', () => {
    const resourcePoolId = '21474836507';
    const resourceTypes = loadPool(`get-available-resource-types/resource-types.json`);
    const resourcePools = loadPool(`get-available-resource-types/resource-pools.json`);
    const availableResourceTypesOutput = loadPool(
      `get-available-resource-types/get-available-resource-types-output.json`,
    );

    expect(getAvailableResourceTypes(resourceTypes, resourcePools, resourcePoolId)).toEqual(
      availableResourceTypesOutput,
    );
  });
  test('deriveResourceTypesFromAvailableResourceTypes', () => {
    const resourceTypes = loadPool(`derived-resource-types/resource-types.json`);
    const availableResourceTypes = loadPool(`derived-resource-types/available-resource-types.json`);
    const derivedResourceTypes = loadPool(`derived-resource-types/derived-resource-types-output.json`);

    expect(deriveResourceTypesFromAvailableResourceTypes(resourceTypes, availableResourceTypes)).toEqual(
      derivedResourceTypes,
    );
  });
  test('isSpecificResourceTypeName', () => {
    expect(
      isSpecificResourceTypeName('ipv4_prefix', ['ipv4_prefix', 'ipv6_prefix', 'vlan_range', 'route_distinguisher']),
    ).toEqual(true);
  });
  test('canSelectIpResourceTypes', () => {
    expect(canSelectIpResourceTypes('ipv4')).toEqual(true);
    expect(canSelectIpResourceTypes('ipv4_prefix')).toEqual(true);
    expect(canSelectIpResourceTypes('ipv6')).toEqual(true);
    expect(canSelectIpResourceTypes('ipv6_prefix')).toEqual(true);

    expect(canSelectIpResourceTypes('unique_id')).toEqual(false);
    expect(canSelectIpResourceTypes('route_distinguisher')).toEqual(false);
  });
  test('isCustomResourceType', () => {
    expect(isCustomResourceType('ipv4_prefix')).toEqual(false);
    expect(isCustomResourceType('custom_resource_type')).toEqual(true);
  });
  test('getAvailablePoolProperties', () => {
    const resourcePools = loadPool(`get-available-pool-properties/resource-pools.json`);
    const parentPoolId = '21474836507';
    const parentResourceId = '17179869185';
    const availableProperties = loadPool(`get-available-pool-properties/get-available-pool-properties-output.json`);

    expect(getAvailablePoolProperties(resourcePools, parentPoolId, parentResourceId)).toEqual(availableProperties);
  });
  test('formatSuggestedProperties', () => {
    const parentResourceTypeName = 'ipv4_prefix';
    const availablePoolProperties = loadPool(`formatted-suggested-properties/available-pool-properties.json`);
    const formatSuggestedPropertiesOutput = ['address: 192.168.0.64, prefix: 27'];

    expect(formatSuggestedProperties(parentResourceTypeName, availablePoolProperties)).toEqual(
      formatSuggestedPropertiesOutput,
    );
  });
  test('getPoolPropertiesSkeleton', () => {
    const resourceTypes = loadPool(`get-pool-properties-skeleton/resource-types.json`);
    const resourceTypeId = '25769803776';
    const poolProperties = {
      address: '',
      prefix: '',
      subnet: '',
    };

    const poolPropertiesSkeleton = loadPool(`get-pool-properties-skeleton/get-pool-properties-skeleton-output.json`);
    expect(getPoolPropertiesSkeleton(resourceTypes, resourceTypeId, poolProperties)).toEqual(poolPropertiesSkeleton);
  });
  test('getSchemaForCreatePoolForm', () => {
    const poolType = 'allocating';
    const isNested = false;

    const poolFormSchemaOutput = loadPool(`get-schema-for-create-pool-form/create-pool-form-schema.json`);
    expect(JSON.parse(JSON.stringify(getSchemaForCreatePoolForm(poolType, isNested)))).toEqual(poolFormSchemaOutput);
  });
});
