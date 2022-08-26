import React, { useCallback, VoidFunctionComponent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { omit } from 'lodash';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  List,
  ListItem,
  Select,
  Spacer,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useTagsInput, SearchByTagInput } from '@frinx/shared/src';
import { useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import PoolValuesForm from './pool-values-form';
import PoolPropertiesForm from './pool-properties-form';
import { SelectPoolsQuery, SelectResourceTypesQuery } from '../../__generated__/graphql';
import {
  getAvailableAllocatedResources,
  getAvailablePoolProperties,
  getAvailableResourceTypes,
  deriveResourceTypesFromAvailableResourceTypes,
  formatSuggestedProperties,
  getPoolPropertiesSkeleton,
  getSchemaForCreatePoolForm,
  canSelectDefaultResourceTypes,
  canSelectIpResourceTypes,
  canSelectCustomResourceTypes,
} from '../../helpers/create-pool-form.helpers';

type PoolType = 'set' | 'allocating' | 'singleton';
export type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  resourceTypeName: string;
  tags: string[];
  allocationStrategyId?: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int' | 'string'>;
  dealocationSafetyPeriod?: number;
  poolType: PoolType;
  poolValues: Record<string, string>[];
  isNested: boolean;
  parentPoolId?: string;
  parentResourceId?: string;
};

const getInitialValues = (url: string, resourceTypes: SelectResourceTypesQuery['QueryResourceTypes']): FormValues => {
  const query = new URLSearchParams(url);
  const resourceType = query.get('resource-type-name') || 'ipv4';

  return {
    name: '',
    description: '',
    dealocationSafetyPeriod: 0,
    resourceTypeId: resourceTypes.find(({ Name }) => Name === resourceType)?.id || '',
    resourceTypeName: resourceType,
    isNested: !!query.get('isNested') || false,
    poolType: 'allocating',
    poolValues: [],
    parentPoolId: query.get('parentPoolId') || undefined,
    parentResourceId: undefined,
    allocationStrategyId: '',
    poolProperties: {},
    poolPropertyTypes: {},
    tags: [],
  };
};

type AllocStrategy = {
  id: string;
  name: string;
};

type Props = {
  onFormSubmit: (values: Omit<FormValues, 'resourceTypeName'>) => void;
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'];
  resourcePools: SelectPoolsQuery;
  allocStrategies: AllocStrategy[];
};

const CreatePoolForm: VoidFunctionComponent<Props> = ({
  onFormSubmit,
  resourceTypes,
  resourcePools,
  allocStrategies,
}) => {
  const navigate = useNavigate();
  const { selectedTags, handleTagCreation, handleOnSelectionChange } = useTagsInput();
  const advancedOptionsDisclosure = useDisclosure();
  const [poolSchema, setPoolSchema] = useState(
    getSchemaForCreatePoolForm(
      getInitialValues(window.location.search, resourceTypes).poolType,
      getInitialValues(window.location.search, resourceTypes).isNested,
    ),
  );
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors, setSubmitting } =
    useFormik<FormValues>({
      initialValues: getInitialValues(window.location.search, resourceTypes),
      validationSchema: poolSchema,
      validateOnChange: false,
      onSubmit: (data) => {
        const resourceTypeName = resourceTypes.find((resourceType) => resourceType.id === data.resourceTypeId)?.Name;
        const allocationStratedyId = allocStrategies.find(
          (allocationStrategy) => allocationStrategy.name === resourceTypeName,
        )?.id;
        const updatedData = {
          ...omit(data, ['resourceTypeName']),
          tags: [...new Set([...selectedTags, data.name])],
          allocationStrategyId: allocationStratedyId,
        };

        onFormSubmit(updatedData);
        setSubmitting(false);
      },
    });

  const { isNested, poolType, resourceTypeId, parentPoolId, parentResourceId } = values;

  const handleFormValuesChange = useCallback(
    (pValues) => {
      setFieldValue('poolValues', pValues);
    },
    [setFieldValue],
  );
  const handlePoolPropertiesChange = useCallback(
    (pProperties) => {
      if (values.poolType === 'allocating') {
        setFieldValue('poolProperties', { ...values.poolProperties, [pProperties.key]: pProperties.value });
      }
    },
    [setFieldValue, values.poolType, values.poolProperties],
  );

  useEffect(() => {
    setPoolSchema(getSchemaForCreatePoolForm(values.poolType, isNested));
    if (!isNested) {
      setFieldValue('parentPoolId', '');
      setFieldValue('parentResourceId', '');
    }
  }, [isNested, values.poolType, setFieldValue]);

  useEffect(() => {
    const [poolProperties, poolPropertyTypes] = getPoolPropertiesSkeleton(
      resourceTypes,
      resourceTypeId,
      values.poolProperties,
    );
    setFieldValue('poolProperties', { ...poolProperties });
    setFieldValue('poolPropertyTypes', { ...poolPropertyTypes });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceTypes, resourceTypeId, setFieldValue]);

  const { QueryResourcePools: pools } = resourcePools;
  const resourceTypeName = resourceTypes.find((rt) => rt.id === resourceTypeId)?.Name ?? null;
  const parentResourceTypeName = pools.find((pool) => pool.id === parentPoolId)?.ResourceType.Name ?? null;
  const availableResourceTypes = getAvailableResourceTypes(resourceTypes, pools, parentPoolId);
  const availableAllocatedResources = getAvailableAllocatedResources(pools, parentPoolId);
  const derivedFromAvailableResourceTypes = deriveResourceTypesFromAvailableResourceTypes(
    resourceTypes,
    availableResourceTypes,
  );
  const availablePoolProperties = getAvailablePoolProperties(resourcePools, parentPoolId, parentResourceId);
  const formattedSuggestedProperties = formatSuggestedProperties(parentResourceTypeName, availablePoolProperties);
  const initialResourceNameType = new URLSearchParams(window.location.search).get('type') || 'default';

  const handleOnResourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    setFieldValue(
      'resourceTypeName',
      [...availableResourceTypes, ...derivedFromAvailableResourceTypes].find((rt) => rt.id === e.target.value)?.Name,
    );
  };

  const [poolProperties, poolPropertyTypes] = getPoolPropertiesSkeleton(
    resourceTypes,
    resourceTypeId,
    values.poolProperties,
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="isNested">
        <FormLabel>Nested</FormLabel>
        <Switch onChange={handleChange} name="isNested" isChecked={isNested} />
      </FormControl>
      {isNested && (
        <HStack spacing={2} marginY={5}>
          <FormControl id="parentPoolId" isInvalid={errors.parentPoolId !== undefined} isRequired>
            <FormLabel htmlFor="parentPool">Parent pool</FormLabel>
            <Select
              id="parentPool"
              name="parentPoolId"
              onChange={handleChange}
              value={parentPoolId}
              placeholder="Select parent resource type"
            >
              {pools
                .filter(
                  (pool) =>
                    pool.Resources.length > 0 &&
                    canSelectCustomResourceTypes(pool.ResourceType.Name, [
                      'ipv4_prefix',
                      'ipv6_prefix',
                      'vlan_range',
                      'route_distinguisher',
                    ]),
                )
                .map((pool) => (
                  <option value={pool.id} key={pool.id}>
                    {pool.Name}
                  </option>
                ))}
            </Select>
            <FormErrorMessage>{errors.parentPoolId}</FormErrorMessage>
          </FormControl>

          <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined} isRequired>
            <FormLabel htmlFor="parentResource">Parent allocated resources</FormLabel>
            <Select
              id="parentResource"
              name="parentResourceId"
              onChange={handleChange}
              value={parentResourceId}
              placeholder="Select parent resource type"
            >
              {availableAllocatedResources.map((pool) => (
                <option value={pool.id} key={pool.id}>
                  {pool.Name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.parentResourceId}</FormErrorMessage>
          </FormControl>
        </HStack>
      )}
      <HStack spacing={2} marginY={5}>
        <FormControl id="resourceTypeId" isInvalid={errors.resourceTypeId !== undefined} isRequired>
          <FormLabel htmlFor="resourceType">Resource type</FormLabel>
          <Select
            id="resourceType"
            name="resourceTypeId"
            value={resourceTypeId}
            onChange={handleOnResourceTypeChange}
            placeholder="Select resource type"
          >
            {[...availableResourceTypes, ...derivedFromAvailableResourceTypes]
              .filter((resourceType) =>
                initialResourceNameType === 'ip'
                  ? canSelectIpResourceTypes(resourceType.Name)
                  : canSelectDefaultResourceTypes(resourceType.Name),
              )
              .map((rt) => (
                <option value={rt.id} key={rt.id}>
                  {rt.Name}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{errors.resourceTypeId}</FormErrorMessage>
        </FormControl>
        <FormControl id="name" marginY={5} isInvalid={errors.name !== undefined} isRequired>
          <FormLabel htmlFor="poolName">Name</FormLabel>
          <Input
            id="poolName"
            type="text"
            onChange={handleChange}
            name="name"
            value={values.name}
            placeholder="Enter name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl id="description">
        <FormLabel htmlFor="descriptionField">Descripton</FormLabel>
        <Textarea
          id="descriptionField"
          onChange={handleChange}
          name="description"
          value={values.description}
          placeholder="Enter description"
        />
      </FormControl>

      {values.poolType !== 'allocating' && resourceTypeName != null && (
        <>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
          <Heading as="h4" size="md">
            Set pool values
          </Heading>
          {isNested && (
            <>
              <Text color="gray">available resources (allocated in selected parent):</Text>
              <List>
                {formattedSuggestedProperties.map((property) => (
                  <ListItem ml={2} color="gray" fontSize="sm" key={property}>
                    {property}
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <PoolValuesForm
            onChange={handleFormValuesChange}
            resourceTypeName={resourceTypeName}
            existingPoolValues={values.poolValues}
            poolValuesErrors={errors.poolValues}
          />
        </>
      )}
      {values.poolType === 'allocating' && resourceTypeName != null && (
        <>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
          <Heading as="h4" size="md">
            Set pool properties
          </Heading>
          {isNested && (
            <>
              <Text color="gray">available resources (allocated in selected parent):</Text>
              <List>
                {formattedSuggestedProperties.map((property) => (
                  <ListItem ml={2} color="gray" fontSize="sm" key={property}>
                    {property}
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <PoolPropertiesForm
            poolProperties={poolProperties}
            poolPropertyTypes={poolPropertyTypes}
            onChange={handlePoolPropertiesChange}
            poolPropertyErrors={errors.poolProperties}
            resourceTypeName={resourceTypeName}
          />
        </>
      )}
      <HStack my={3}>
        <Divider />
        <HStack cursor="pointer" textColor="gray.500" onClick={advancedOptionsDisclosure.onToggle}>
          <Text width="max-content">Advanced options</Text>
          {advancedOptionsDisclosure.isOpen ? (
            <FeatherIcon icon="chevron-up" size={20} />
          ) : (
            <FeatherIcon icon="chevron-down" size={20} />
          )}
        </HStack>
        <Divider />
      </HStack>
      {advancedOptionsDisclosure.isOpen && (
        <Box>
          <HStack>
            <FormControl id="poolType">
              <FormLabel htmlFor="poolTypeName">Pool type</FormLabel>
              <Select id="poolTypeName" name="poolType" value={poolType} onChange={handleChange}>
                {['set', 'allocating', 'singleton'].map((o) => (
                  <option value={o} key={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </FormControl>
            {values.poolType !== 'singleton' && (
              <FormControl id="dealocationSafetyPeriod" isInvalid={errors.dealocationSafetyPeriod !== undefined}>
                <FormLabel htmlFor="dealocationPeriod">Dealocation safety period</FormLabel>
                <Input
                  id="dealocationPeriod"
                  type="text"
                  onChange={handleChange}
                  name="dealocationSafetyPeriod"
                  value={values.dealocationSafetyPeriod}
                  placeholder="Enter dealocation safety period"
                />
                <FormErrorMessage>{errors.dealocationSafetyPeriod}</FormErrorMessage>
              </FormControl>
            )}
          </HStack>

          <FormControl mt={2}>
            <SearchByTagInput
              selectedTags={selectedTags}
              onTagCreate={handleTagCreation}
              onSelectionChange={handleOnSelectionChange}
            />
          </FormControl>
        </Box>
      )}
      <HStack mt={4}>
        <Spacer />
        <Button onClick={() => navigate(-1)} variant="solid">
          Cancel
        </Button>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create pool
        </Button>
      </HStack>
    </form>
  );
};

export default CreatePoolForm;
