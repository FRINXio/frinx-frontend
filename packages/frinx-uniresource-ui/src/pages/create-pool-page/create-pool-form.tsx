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
  Select,
  Switch,
} from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import PoolValuesForm from './pool-values-form';
import PoolPropertiesForm from './pool-properties-form';
import SearchByTagInput from '../../components/search-by-tag-input';
import { useTagsInput } from '../../hooks/use-tags-input';

type PoolType = 'set' | 'allocating' | 'singleton';
type FormValues = {
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
  isNested: false;
  parentResourceId?: undefined;
};

const INITIAL_VALUES: FormValues = {
  name: '',
  description: '',
  dealocationSafetyPeriod: 0,
  resourceTypeId: '',
  isNested: false,
  poolType: 'set',
  poolValues: [],
  parentResourceId: undefined,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allocationStrategyId: '',
  poolProperties: {},
  poolPropertyTypes: {},
  tags: [],
};

type ResourceType = {
  id: string;
  name: string;
};
type Pool = {
  id: string;
  name: string;
};
type AllocStrategy = {
  id: string;
  name: string;
};

type Props = {
  onFormSubmit: (values: FormValues) => void;
  resourceTypes: ResourceType[];
  pools: Pool[];
  allocStrategies: AllocStrategy[];
};

function getPoolPropertiesSkeleton(
  resourceTypes: ResourceType[],
  resourceTypeId: string,
  values: FormValues['poolProperties'],
): [poolProperties: Record<string, string>, poolValues: Record<string, 'int' | 'string'>] {
  const resourceTypeName = resourceTypes.find((type) => type.id === resourceTypeId)?.name;
  let result: [poolProperties: Record<string, string>, poolValues: Record<string, 'int' | 'string'>] = [{}, {}];

  switch (resourceTypeName) {
    case 'ipv6_prefix':
    case 'ipv4_prefix':
      result = [
        { prefix: values?.prefix || '', address: values?.address || '' },
        { prefix: 'int', address: 'string' },
      ];
      break;
    case 'random_signed_int32':
      result = [{ int: values?.int || '' }, { int: 'int' }];
      break;
    case 'route_distinguisher':
      result = [{ rd: values?.rd || '' }, { rd: 'string' }];
      break;
    case 'ipv4':
    case 'ipv6':
      result = [{ address: values?.address || '' }, { address: 'string' }];
      break;
    case 'vlan':
      result = [{ vlan: values?.vlan || '' }, { vlan: 'int' }];
      break;
    case 'vlan_range':
      result = [
        { from: values?.from || '', to: values?.to || '' },
        { from: 'int', to: 'int' },
      ];
      break;
    case 'unique_id':
      result = [{ id: values?.id || '' }, { id: 'string' }];
      break;
    default:
      break;
  }

  return result;
}

function getSchema(poolType: string, isNested: boolean) {
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
        ...(isNested && { parentResourceId: yup.string().required('Please enter parent resource type') }),
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
        ...(isNested && { parentResourceId: yup.string().required('Please enter parent resource type') }),
      });

    default:
      return yup.object({
        name: yup.string().required('Please enter a name'),
        description: yup.string().notRequired(),
        tags: yup.array(),
        resourceTypeId: yup.string().required('Please enter resource type'),
        ...(isNested && { parentResourceId: yup.string().required('Please enter parent resource type') }),
      });
  }
}

const CreatePoolForm: VoidFunctionComponent<Props> = ({ onFormSubmit, resourceTypes, pools, allocStrategies }) => {
  const { selectedTags, handleTagCreation, handleOnSelectionChange } = useTagsInput();
  const [poolSchema, setPoolSchema] = useState(getSchema(INITIAL_VALUES.poolType, INITIAL_VALUES.isNested));
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: async (data) => {
      const resourceTypeName = resourceTypes.find((resourceType) => resourceType.id === data.resourceTypeId)?.name;
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

  const { isNested, poolType, resourceTypeId, parentResourceId } = values;
  const resourceTypeName = resourceTypes.find((rt) => rt.id === resourceTypeId)?.name ?? null;

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
  }, [isNested, values.poolType]);

  useEffect(() => {
    const [poolProperties] = getPoolPropertiesSkeleton(resourceTypes, resourceTypeId, values.poolProperties);
    setFieldValue('poolProperties', { ...poolProperties });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceTypes, resourceTypeId, setFieldValue]);

  const [poolProperties, poolPropertyTypes] = getPoolPropertiesSkeleton(
    resourceTypes,
    resourceTypeId,
    values.poolProperties,
  );

  return (
    <form onSubmit={handleSubmit}>
      <HStack spacing={4} marginY={5}>
        <FormControl id="isNested">
          <FormLabel>Nested</FormLabel>
          <Switch onChange={handleChange} name="isNested" isChecked={isNested} />
        </FormControl>
        {isNested && (
          <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined}>
            <FormLabel>Parent pool</FormLabel>
            <Select
              name="parentResourceId"
              onChange={handleChange}
              value={parentResourceId}
              placeholder="Select parent resource type"
            >
              {pools.map((pool) => (
                <option value={pool.id} key={pool.id}>
                  {pool.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.parentResourceId}</FormErrorMessage>
          </FormControl>
        )}
      </HStack>
      <HStack spacing={2} marginY={5}>
        <FormControl id="poolType">
          <FormLabel>Pool type</FormLabel>
          <Select name="poolType" value={poolType} onChange={handleChange}>
            {['set', 'allocating', 'singleton'].map((o) => (
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
            {resourceTypes.map((rt) => (
              <option value={rt.id} key={rt.id}>
                {rt.name}
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
            <PoolValuesForm
              onChange={handleFormValuesChange}
              resourceTypeName={resourceTypeName}
              existingPoolValues={values.poolValues}
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
            <PoolPropertiesForm
              poolProperties={poolProperties}
              poolPropertyTypes={poolPropertyTypes}
              onChange={handlePoolPropertiesChange}
              poolPropertyErrors={errors.poolProperties}
            />
            {/* <p>{errors.poolProperties[0]}</p> */}
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
