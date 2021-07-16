import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import gql from 'graphql-tag';
import { omitBy } from 'lodash';
import React, { FC, useCallback } from 'react';
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

type FormValues = {
  poolName: string;
  dealocationSafetyPeriod: number;
  allocationStrategyId: string;
  resourceTypeId: string;
  poolProperties?: Record<string, string>;
  poolPropertyTypes?: Record<string, 'int' | 'string'>;
};

const INITIAL_VALUES: FormValues = {
  poolName: '',
  dealocationSafetyPeriod: 120,
  allocationStrategyId: '',
  resourceTypeId: '',
  poolProperties: { address: '10.0.0.0', prefix: '16' },
  poolPropertyTypes: { address: 'string', prefix: 'int' },
};

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
});

type Props = {
  onFormSubmit: (values: FormValues) => void;
};

const CreateAllocatingIpv4PrefixPoolForm: FC<Props> = ({ onFormSubmit }) => {
  const [{ data: resourceTypeData, fetching }] = useQuery({
    query: RESOURCE_TYPE_QUERY,
  });

  const [{ data: allocationStrategy }] = useQuery({
    query: ALLOCATION_STRATEGY_QUERY,
  });

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    onSubmit: async (data) => {
      const resourceTypeId = await resourceTypeData?.QueryResourceTypes[0].id;
      const allocationStrategyId = await allocationStrategy?.QueryAllocationStrategies[0].id;
      onFormSubmit({ ...data, resourceTypeId, allocationStrategyId });
    },
  });

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

  if (fetching) {
    return <Spinner size="xl" />;
  }

  return (
    <form onSubmit={handleSubmit}>
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
