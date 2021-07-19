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
  Spinner,
  Switch,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import gql from 'graphql-tag';
import { omitBy } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'urql';
import * as yup from 'yup';
import PoolPropertiesForm from '../pages/create-pool-page/pool-properties-form';

const ALLOCATION_STRATEGY_QUERY = gql`
  query QueryAllocationStrategyByName {
    QueryAllocationStrategies(byName: "ipv4_prefix") {
      Name
      id
    }
  }
`;

const RESOURCE_TYPE_QUERY = gql`
  query QueryResourceTypeByName {
    QueryResourceTypes(byName: "ipv4_prefix") {
      Name
      id
    }
  }
`;

const POSSIBLE_PARENT_POOLS_QUERY = gql`
  query QueryPossibleParentPools($resourceTypeId: ID!) {
    QueryResourcePools(resourceTypeId: $resourceTypeId) {
      Name
      id
    }
  }
`;

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  resourceTypeId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int' | 'string'>;
  parentResourceId: undefined;
  isNested: boolean;
};

const INITIAL_VALUES: FormValues = {
  poolName: '',
  dealocationSafetyPeriod: 120,
  allocationStrategyId: '',
  resourceTypeId: '',
  poolProperties: { address: '10.0.0.0', prefix: '16' },
  poolPropertyTypes: { address: 'string', prefix: 'int' },
  parentResourceId: undefined,
  isNested: false,
};

const getPoolSchema = (isNested: boolean) => {
  const poolSchema = yup.object({
    poolName: yup.string().required('Please enter name of pool'),
    dealocationSafetyPeriod: yup
      .number()
      .min(0, 'Please enter positive number')
      .required('Please enter a dealocation safety period')
      .typeError('Please enter a number'),
    poolProperties: yup.object({
      address: yup.string().required('Please enter address'),
      prefix: yup.string().required('Please enter prefix'),
    }),
    ...(isNested && { parentResourceId: yup.string().required('Please enter parent resource type') }),
  });

  return poolSchema;
};

type Props = {
  onFormSubmit: (values: FormValues) => void;
};

type Pool = {
  id: string;
  name: string;
};

const CreateAllocatingIpv4PrefixPoolForm: FC<Props> = ({ onFormSubmit }) => {
  const resourceTypeId = useRef('');
  const allocationStrategyId = useRef('');

  const [poolSchema, setPoolSchema] = useState(getPoolSchema(INITIAL_VALUES.isNested));
  const [pools, setPools] = useState([] as Pool[]);

  const [{ data: resourceTypeData, fetching }] = useQuery({
    query: RESOURCE_TYPE_QUERY,
  });
  const [{ data: allocationStrategy }] = useQuery({
    query: ALLOCATION_STRATEGY_QUERY,
  });

  useEffect(() => {
    resourceTypeId.current = resourceTypeData?.QueryResourceTypes[0].id;
    allocationStrategyId.current = allocationStrategy?.QueryAllocationStrategies[0].id;
  }, [allocationStrategy?.QueryAllocationStrategies, resourceTypeData?.QueryResourceTypes]);

  const [result] = useQuery({
    query: POSSIBLE_PARENT_POOLS_QUERY,
    variables: { resourceTypeId },
  });

  const { data: possibleParentPools, fetching: possibleParentPoolsFetching } = result;

  useEffect(() => {
    if (possibleParentPools) {
      setPools(
        possibleParentPools?.QueryResourcePools.map((pool) => {
          return { ...pool, name: pool.Name };
        }),
      );
    }
  }, [possibleParentPools]);

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    onSubmit: async (data) => {
      onFormSubmit({
        ...data,
        resourceTypeId: resourceTypeId.current,
        allocationStrategyId: allocationStrategyId.current,
      });
    },
  });

  useEffect(() => {
    setPoolSchema(getPoolSchema(values.isNested));
  }, [values.isNested]);

  const handlePoolPropertiesChange = useCallback(
    (pProperties) => {
      setFieldValue('poolProperties', { ...values.poolProperties, [pProperties.key]: pProperties.value });
      setFieldValue('poolPropertyTypes', { ...values.poolPropertyTypes, [pProperties.key]: pProperties.type });
    },
    [setFieldValue, values],
  );
  const handleDeleteProperty = useCallback(
    (key: string) => {
      setFieldValue(
        'poolProperties',
        omitBy(values.poolProperties, (_, k) => k === key),
      );
      setFieldValue(
        'poolPropertyTypes',
        omitBy(values.poolPropertyTypes, (_, k) => k === key),
      );
    },
    [setFieldValue, values],
  );

  if (fetching || possibleParentPoolsFetching) {
    return <Spinner size="xl" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {possibleParentPools && (
        <HStack spacing={4} marginY={5}>
          <FormControl id="isNested">
            <FormLabel>Nested</FormLabel>
            <Switch onChange={handleChange} name="isNested" isChecked={values.isNested} />
          </FormControl>
          {values.isNested && (
            <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined}>
              <FormLabel>Parent pool</FormLabel>
              <Select
                name="parentResourceId"
                onChange={handleChange}
                value={values.parentResourceId}
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
      )}
      <FormControl id="poolName" marginY={5} isInvalid={errors.poolName !== undefined}>
        <FormLabel>Name</FormLabel>
        <Input type="text" onChange={handleChange} name="poolName" placeholder="Enter name" value={values.poolName} />
        <FormErrorMessage>{errors.poolName}</FormErrorMessage>
      </FormControl>
      <FormControl id="dealocationSafetyPeriod" marginY={5} isInvalid={errors.dealocationSafetyPeriod !== undefined}>
        <FormLabel>Pool dealocation safety period</FormLabel>
        <Input
          type="number"
          value={values.dealocationSafetyPeriod}
          onChange={handleChange}
          name="dealocationSafetyPeriod"
          placeholder="Enter dealocation safety period"
        />
        <FormErrorMessage>{errors.dealocationSafetyPeriod}</FormErrorMessage>
      </FormControl>
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
        <FormErrorMessage>{errors.poolProperties}</FormErrorMessage>
      </Box>
      <Divider marginY={5} orientation="horizontal" color="gray.200" />
      <Button type="submit" colorScheme="blue">
        Create pool
      </Button>
    </form>
  );
};

export default CreateAllocatingIpv4PrefixPoolForm;
