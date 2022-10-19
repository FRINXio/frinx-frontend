import React, { VoidFunctionComponent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { omit } from 'lodash';
import {
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
} from '@chakra-ui/react';
import { useTagsInput } from '@frinx/shared/src';
import { useNavigate } from 'react-router-dom';
import PoolValuesForm from './pool-values-form';
import PoolPropertiesForm from './pool-properties-form';
import { RequiredPoolPropertiesQuery, SelectPoolsQuery, SelectResourceTypesQuery } from '../../__generated__/graphql';
import {
  getAvailableAllocatedResources,
  getAvailablePoolProperties,
  getAvailableResourceTypes,
  deriveResourceTypesFromAvailableResourceTypes,
  formatSuggestedProperties,
  getPoolPropertiesSkeleton,
  getSchemaForCreatePoolForm,
  canSelectIpResourceTypes,
  isCustomResourceType,
} from '../../helpers/create-pool-form.helpers';
import AdvancedOptions from './create-pool-form-advanced-options';
import NestedFormPart from './create-pool-form-nested-part';
import CustomPoolPropertiesForm from './custom-pool-properties-form';

type PoolType = 'set' | 'allocating' | 'singleton';
export type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  resourceTypeName: string;
  tags: string[];
  allocationStrategyId?: string;
  poolProperties?: Record<string, string | number>;
  poolPropertyTypes?: Record<string, 'int' | 'string' | 'bool'>;
  dealocationSafetyPeriod?: number;
  poolType: PoolType;
  poolValues: Record<string, string>[];
  isNested: boolean;
  parentPoolId?: string;
  parentResourceId?: string;
};

type AllocStrategy = {
  id: string;
  name: string;
};

type Props = {
  onFormSubmit: (values: Omit<FormValues, 'resourceTypeName'>) => void;
  onResourceTypeChange: (resourceTypeId: string) => void;
  requiredPoolProperties?: RequiredPoolPropertiesQuery['QueryRequiredPoolProperties'];
  isLoadingRequiredPoolProperties: boolean;
  resourceTypes: SelectResourceTypesQuery['QueryResourceTypes'];
  resourcePools: SelectPoolsQuery;
  allocStrategies: AllocStrategy[];
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

const CreatePoolForm: VoidFunctionComponent<Props> = ({
  onFormSubmit,
  resourceTypes,
  resourcePools,
  allocStrategies,
  isLoadingRequiredPoolProperties,
  onResourceTypeChange,
  requiredPoolProperties,
}) => {
  const navigate = useNavigate();
  const tagsInput = useTagsInput();
  const [validationSchema, setValidationSchema] = useState(
    getSchemaForCreatePoolForm(
      getInitialValues(window.location.search, resourceTypes).poolType,
      getInitialValues(window.location.search, resourceTypes).isNested,
    ),
  );
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors, setSubmitting } =
    useFormik<FormValues>({
      initialValues: getInitialValues(window.location.search, resourceTypes),
      validationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (data) => {
        const resourceTypeName = resourceTypes.find((resourceType) => resourceType.id === data.resourceTypeId)?.Name;
        const allocationStrategyId = allocStrategies.find(
          (allocationStrategy) => allocationStrategy.name === resourceTypeName,
        )?.id;
        const updatedData = {
          ...omit(data, ['resourceTypeName']),
          tags: [...new Set([...tagsInput.selectedTags, data.name])],
          allocationStrategyId,
        };

        onFormSubmit(updatedData);
        setSubmitting(false);
      },
    });

  const { isNested, poolType, resourceTypeId, parentPoolId, parentResourceId } = values;

  useEffect(() => {
    setValidationSchema(getSchemaForCreatePoolForm(values.poolType, isNested));
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
    const selectedResourceTypeName = [...availableResourceTypes, ...derivedFromAvailableResourceTypes].find(
      (rt) => rt.id === e.target.value,
    )?.Name;
    handleChange(e);
    setFieldValue('resourceTypeName', selectedResourceTypeName);

    if (selectedResourceTypeName != null && isCustomResourceType(selectedResourceTypeName)) {
      onResourceTypeChange(selectedResourceTypeName);
    }
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
        <NestedFormPart
          availableAllocatedResources={availableAllocatedResources}
          errors={errors}
          handleChange={handleChange}
          parentPoolId={parentPoolId}
          parentResourceId={parentResourceId}
          pools={pools}
        />
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
                initialResourceNameType === 'ip' ? canSelectIpResourceTypes(resourceType.Name) : true,
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
        <FormLabel htmlFor="descriptionField">Description</FormLabel>
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
            onChange={(poolValues) => setFieldValue('poolValues', poolValues)}
            resourceTypeName={resourceTypeName}
            existingPoolValues={values.poolValues}
            poolValuesErrors={errors.poolValues}
          />
        </>
      )}
      {resourceTypeName !== 'route_distinguisher' && values.poolType === 'allocating' && resourceTypeName != null && (
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

          {isCustomResourceType(values.resourceTypeName) ? (
            <CustomPoolPropertiesForm
              isLoadingPoolProperties={isLoadingRequiredPoolProperties}
              customPoolProperties={requiredPoolProperties}
              formValues={values}
              onChange={({ key, value }) => setFieldValue(`poolProperties.${key}`, value)}
              poolPropertyErrors={errors.poolProperties}
            />
          ) : (
            <PoolPropertiesForm
              poolProperties={poolProperties}
              poolPropertyTypes={poolPropertyTypes}
              onChange={({ key, value }) => setFieldValue(`poolProperties.${key}`, value)}
              poolPropertyErrors={errors.poolProperties}
              resourceTypeName={resourceTypeName}
            />
          )}
        </>
      )}

      <AdvancedOptions
        poolPropertiesErrors={errors}
        poolType={poolType}
        tagsParams={tagsInput}
        values={values}
        handleChange={handleChange}
      />

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
