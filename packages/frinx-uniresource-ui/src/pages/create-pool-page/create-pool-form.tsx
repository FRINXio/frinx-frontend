import React, { useCallback, VoidFunctionComponent, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
  Switch,
  Text,
} from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import PoolValuesForm from './pool-values-form';
import PoolPropertiesForm from './pool-properties-form';
import SearchByTagInput from '../../components/search-by-tag-input';
import { useTagsInput } from '../../hooks/use-tags-input';
import { SelectPoolsQuery, SelectResourceTypesQuery } from '../../__generated__/graphql';
import {
  canSelectAllocatingStrategy,
  getAvailableAllocatedResources,
  getAvailablePoolProperties,
  getAvailableResourceTypes,
  deriveResourceTypesFromAvailableResourceTypes,
  formatSuggestedProperties,
  getPoolPropertiesSkeleton,
} from '../../helpers/create-pool-form.helpers';

type PoolType = 'set' | 'allocating' | 'singleton';
export type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
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

const getInitialValues = (url: string): FormValues => {
  const query = new URLSearchParams(url);

  return {
    name: '',
    description: '',
    dealocationSafetyPeriod: 0,
    resourceTypeId: '',
    isNested: !!query.get('isNested') || false,
    poolType: 'set',
    poolValues: [],
    parentPoolId: query.get('parentPoolId') || undefined,
    parentResourceId: undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

function getSchema(poolType: string, isNested: boolean) {
  const ipv4: RegExp = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;
  const ipv6: RegExp =
    /(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/;
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
        poolProperties: yup.lazy((poolProperties) => {
          return yup.object({
            ...Object.keys(poolProperties).reduce((acc, key) => {
              return {
                ...acc,
                [key]: yup.string().required('Please enter a value'),
              };
            }, {}),
          });
        }),
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
        tags: yup.array(),
        dealocationSafetyPeriod: yup
          .number()
          .min(0, 'Please enter positive number')
          .required('Please enter a dealocation safety period')
          .typeError('Please enter a number'),
        poolValues: yup.array(
          yup.lazy((poolValues: Array<Record<string, string>>) => {
            return yup.array().of(
              yup
                .string()
                .when('resourceTypeId', {
                  is: '25769803777',
                  then: yup.string().required().matches(ipv4, {
                    message: 'Invalid ip address',
                  }),
                })
                .when('resourceTypeId', {
                  is: '25769803780',
                  then: yup.string().required().matches(ipv4, {
                    message: 'Invalid ip address',
                  }),
                })
                .when('resourceTypeId', {
                  is: '25769803776',
                  then: yup.string().required().matches(ipv6, {
                    message: 'Invalid ip address',
                  }),
                })
                .when('resourceTypeId', {
                  is: '25769803779',
                  then: yup.string().required().matches(ipv6, {
                    message: 'Invalid ip address',
                  }),
                  otherwise: yup.object().shape({
                    ...Object.keys(poolValues[0] ?? {}).reduce((acc, key) => {
                      return {
                        ...acc,
                        [key]: yup.string().required('Please enter a value'),
                      };
                    }, {}),
                  }),
                }),
            );
          }),
        ),
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

type Props = {
  onFormSubmit: (values: FormValues) => void;
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
  const { selectedTags, handleTagCreation, handleOnSelectionChange } = useTagsInput();
  const [poolSchema, setPoolSchema] = useState(
    getSchema(getInitialValues(window.location.search).poolType, getInitialValues(window.location.search).isNested),
  );
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors } = useFormik<FormValues>({
    initialValues: getInitialValues(window.location.search),

    validationSchema: poolSchema,
    validateOnChange: false,
    onSubmit: async (data) => {
      const resourceTypeName = resourceTypes.find((resourceType) => resourceType.id === data.resourceTypeId)?.Name;
      console.log(values);
      const allocationStratedyId = allocStrategies.find(
        (allocationStrategy) => allocationStrategy.name === resourceTypeName,
      )?.id;
      const updatedData: FormValues = {
        ...data,
        tags: selectedTags.map(({ label }: Item) => label),
        allocationStrategyId: allocationStratedyId,
      };

      onFormSubmit(updatedData);
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
    setPoolSchema(getSchema(values.poolType, isNested));

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
  const canSelectAllocatingType = canSelectAllocatingStrategy(resourceTypes, resourceTypeId);
  const availablePoolProperties = getAvailablePoolProperties(resourcePools, parentPoolId, parentResourceId);
  const formattedSuggestedProperties = formatSuggestedProperties(parentResourceTypeName, availablePoolProperties);

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
          <FormControl id="parentPoolId" isInvalid={errors.parentPoolId !== undefined}>
            <FormLabel>Parent pool</FormLabel>
            <Select
              name="parentPoolId"
              onChange={handleChange}
              value={parentPoolId}
              placeholder="Select parent resource type"
            >
              {pools.map((pool) => (
                <option value={pool.id} key={pool.id}>
                  {pool.Name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.parentPoolId}</FormErrorMessage>
          </FormControl>

          <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined}>
            <FormLabel>Parent allocated resources</FormLabel>
            <Select
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
        <FormControl id="poolType">
          <FormLabel>Pool type</FormLabel>
          <Select name="poolType" value={poolType} onChange={handleChange}>
            {['set', 'allocating', 'singleton']
              .filter((type) => (type === 'allocating' ? canSelectAllocatingType : true))
              .map((o) => (
                <option value={o} key={o}>
                  {o}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl id="resourceTypeId" isInvalid={errors.resourceTypeId !== undefined}>
          <FormLabel>Resource type</FormLabel>
          <Select
            name="resourceTypeId"
            value={resourceTypeId}
            onChange={handleChange}
            placeholder="Select resource type"
          >
            {[...availableResourceTypes, ...derivedFromAvailableResourceTypes].map((rt) => (
              <option value={rt.id} key={rt.id}>
                {rt.Name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.resourceTypeId}</FormErrorMessage>
        </FormControl>
      </HStack>
      <FormControl id="name" marginY={5} isInvalid={errors.name !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input type="text" onChange={handleChange} name="name" value={values.name} placeholder="Enter name" />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl my={5}>
        <SearchByTagInput
          selectedTags={selectedTags}
          onTagCreate={handleTagCreation}
          onSelectionChange={handleOnSelectionChange}
        />
      </FormControl>
      <FormControl id="description" marginY={5}>
        <FormLabel>Descripton</FormLabel>
        <Input
          type="text"
          onChange={handleChange}
          name="description"
          value={values.description}
          placeholder="Enter description"
        />
      </FormControl>
      {values.poolType !== 'singleton' && (
        <FormControl id="dealocationSafetyPeriod" marginY={5} isInvalid={errors.dealocationSafetyPeriod !== undefined}>
          <FormLabel>Dealocation safety period</FormLabel>
          <Input
            type="text"
            onChange={handleChange}
            name="dealocationSafetyPeriod"
            value={values.dealocationSafetyPeriod}
            placeholder="Enter dealocation safety period"
          />
          <FormErrorMessage>{errors.dealocationSafetyPeriod}</FormErrorMessage>
        </FormControl>
      )}
      {values.poolType !== 'allocating' && resourceTypeName != null && (
        <>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
          <Box width="50%">
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
          </Box>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
        </>
      )}
      {values.poolType === 'allocating' && (
        <>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
          <Box>
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
            />
          </Box>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
        </>
      )}
      <FormControl marginY={5}>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create pool
        </Button>
      </FormControl>
    </form>
  );
};

export default CreatePoolForm;
