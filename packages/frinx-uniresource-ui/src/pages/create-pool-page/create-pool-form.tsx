import React, { useCallback, VoidFunctionComponent, useState, useEffect } from 'react';
import omitBy from 'lodash/omitBy';
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
import PoolValuesForm from './pool-values-form';
import PoolPropertiesForm from './pool-properties-form';

type PoolType = 'set' | 'allocating' | 'singleton';
type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
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

const defaultPoolSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  description: yup.string().notRequired(),
  resourceTypeId: yup.string().required('Resource type is required field'),
});

const allocatingPoolSchema = yup.object({
  dealocationSafetyPeriod: yup
    .number()
    .integer('Dealocation safety period is not a number')
    .required(' Dealocation safety period is required field'),
  allocationStrategyId: yup.string().required('Allocation strategy is required field'),
  poolProperties: yup.object().notRequired(),
  poolPropertyTypes: yup.object().notRequired(),
});

const setTypePoolSchema = yup.object({
  dealocationSafetyPeriod: yup
    .number()
    .integer('Dealocation safety period is not a number')
    .required(' Dealocation safety period is required field'),
});

const nestedPoolSchema = yup.object({
  parentResourceId: yup.string().required('Parent resource type is required field'),
});

const CreatePoolForm: VoidFunctionComponent<Props> = ({ onFormSubmit, resourceTypes, pools, allocStrategies }) => {
  const [poolSchema, setPoolSchema] = useState(defaultPoolSchema);
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors, isValid } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    onSubmit: async (data) => {
      onFormSubmit(data);
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
        setFieldValue('poolPropertyTypes', { ...values.poolPropertyTypes, [pProperties.key]: pProperties.type });
      }
    },
    [setFieldValue, values],
  );
  const handleDeleteProperty = useCallback(
    (key: string) => {
      if (values.poolType === 'allocating') {
        setFieldValue(
          'poolProperties',
          omitBy(values.poolProperties, (_, k) => k === key),
        );
        setFieldValue(
          'poolPropertyTypes',
          omitBy(values.poolPropertyTypes, (_, k) => k === key),
        );
      }
    },
    [setFieldValue, values],
  );

  useEffect(() => {
    setPoolSchema(defaultPoolSchema);
    switch (values.poolType) {
      case 'allocating':
        setPoolSchema(defaultPoolSchema.concat(allocatingPoolSchema));
        break;

      case 'set':
        setPoolSchema(defaultPoolSchema.concat(setTypePoolSchema));
        break;

      default:
        setPoolSchema(defaultPoolSchema);
        break;
    }
    if (isNested) {
      setPoolSchema(defaultPoolSchema.concat(nestedPoolSchema));
    }
  }, [isNested, values.poolType]);

  return (
    <form onSubmit={handleSubmit}>
      <HStack spacing={4} marginY={5}>
        <FormControl id="isNested">
          <FormLabel>Nested</FormLabel>
          <Switch onChange={handleChange} name="isNested" isChecked={isNested} />
        </FormControl>
        {isNested && (
          <FormControl id="parentResourceId" isInvalid={!!errors && !!errors.parentResourceId}>
            <FormLabel>Parent pool</FormLabel>
            <Select name="parentResourceId" onChange={handleChange} value={parentResourceId}>
              <option value="" disabled>
                Select parent pool
              </option>
              {pools.map((pool) => (
                <option value={pool.id} key={pool.id}>
                  {pool.name}
                </option>
              ))}
            </Select>
            {errors.parentResourceId && <FormErrorMessage>{errors.parentResourceId}</FormErrorMessage>}
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
        <FormControl id="resourceTypeId">
          <FormLabel>Resource type</FormLabel>
          <Select name="resourceTypeId" value={resourceTypeId} onChange={handleChange}>
            <option value="" disabled>
              Select resource type
            </option>
            {resourceTypes.map((rt) => (
              <option value={rt.id} key={rt.id}>
                {rt.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>
      <FormControl id="name" marginY={5} isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input type="text" onChange={handleChange} name="name" value={values.name} placeholder="Enter name" />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
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
        <FormControl id="dealocationSafetyPeriod" marginY={5}>
          <FormLabel>Dealocation safety period</FormLabel>
          <Input
            type="text"
            onChange={handleChange}
            name="dealocationSafetyPeriod"
            value={values.dealocationSafetyPeriod}
            placeholder="Enter dealocation safety period"
          />
          {!!errors.dealocationSafetyPeriod && <FormErrorMessage>{errors.dealocationSafetyPeriod}</FormErrorMessage>}
        </FormControl>
      )}
      {values.poolType === 'allocating' && (
        <FormControl id="allocationStrategyId" marginY={5}>
          <FormLabel>Allocation strategy</FormLabel>
          <Select onChange={handleChange} name="allocationStrategyId" values={values.allocationStrategyId}>
            <option value="" disabled>
              Select allocation strategy
            </option>
            {allocStrategies.map((as) => (
              <option key={as.id} value={as.id}>
                {as.name}
              </option>
            ))}
          </Select>
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
              poolProperties={values.poolProperties as Record<string, string>}
              poolPropertyTypes={values.poolPropertyTypes as Record<string, 'int' | 'string'>}
              onChange={handlePoolPropertiesChange}
              onDeleteBtnClick={handleDeleteProperty}
            />
          </Box>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
        </>
      )}
      <FormControl marginY={5}>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting} disabled={!isValid}>
          Create pool
        </Button>
      </FormControl>
    </form>
  );
};

export default CreatePoolForm;
