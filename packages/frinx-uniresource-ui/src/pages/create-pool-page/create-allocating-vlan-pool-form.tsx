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
import { useFormik } from 'formik';
import { omitBy } from 'lodash';
import React, { FC, useCallback, useState, useEffect } from 'react';
import * as yup from 'yup';
import PoolPropertiesForm from './pool-properties-form';

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  resourceTypeId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int'>;
  parentResourceId: undefined;
  isNested: boolean;
};

const INITIAL_VALUES: FormValues = {
  poolName: '',
  dealocationSafetyPeriod: 120,
  allocationStrategyId: '',
  resourceTypeId: '',
  poolProperties: { from: '0', to: '4095' },
  poolPropertyTypes: { from: 'int', to: 'int' },
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
      from: yup
        .number()
        .min(0, 'Please enter positive number')
        .required('Please enter a from property')
        .typeError('Please enter a number'),
      to: yup
        .number()
        .min(1, 'Please enter number bigger than 0')
        .max(4095, 'Please enter number smaller than 4096')
        .required('Please enter a to property')
        .typeError('Please enter a number'),
      ...(isNested && { parentResourceId: yup.string().required('Please enter parent resource type') }),
    }),
  });

  return poolSchema;
};

type Props = {
  onFormSubmit: (values: FormValues) => void;
  resourceTypeId: string;
  allocationStrategyId: string;
  possibleParentPools: Pool[] | null;
};

type Pool = {
  id: string;
  name: string;
  resourceTypeId: string;
};

const CreateAllocatingVlanPoolForm: FC<Props> = ({
  onFormSubmit,
  resourceTypeId,
  allocationStrategyId,
  possibleParentPools,
}) => {
  const [poolSchema, setPoolSchema] = useState(getPoolSchema(INITIAL_VALUES.isNested));

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    onSubmit: (data) => {
      onFormSubmit({
        ...data,
        resourceTypeId,
        allocationStrategyId,
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
                {possibleParentPools.map((pool) => (
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
          poolPropertyTypes={values.poolPropertyTypes as Record<string, 'int'>}
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

export default CreateAllocatingVlanPoolForm;
