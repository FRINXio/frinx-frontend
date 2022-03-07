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
import React, { FC, useCallback, useState, useEffect } from 'react';
import * as yup from 'yup';
import SearchByTagInput from '../../components/search-by-tag-input';
import { useTagsInput } from '../../hooks/use-tags-input';
import PoolPropertiesForm from './pool-properties-form';

type FormValues = {
  poolName: string;
  tags: string[];
  poolDealocationSafetyPeriod: number;
  allocationStrategyId: string;
  resourceTypeId: string;
  poolProperties: Record<string, string>;
  poolPropertyTypes: Record<string, 'int'>;
  parentResourceId?: undefined;
};

const INITIAL_VALUES: FormValues = {
  poolName: '',
  tags: [],
  poolDealocationSafetyPeriod: 120,
  allocationStrategyId: '',
  resourceTypeId: '',
  poolProperties: { from: '0', to: '4095' },
  poolPropertyTypes: { from: 'int', to: 'int' },
};

const getPoolSchema = (isNested: boolean) => {
  const poolSchema = yup.object({
    poolName: yup.string().required('Please enter name of pool'),
    tags: yup.array(),
    poolDealocationSafetyPeriod: yup
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
  onFormSubmit: (values: FormValues, isNested: boolean) => void;
  resourceTypeId: string;
  allocationStrategyId: string;
  possibleParentPools: Pool[] | null;
};

type Pool = {
  id: string;
  Name: string;
  ResourceType: {
    id: string;
  };
};

const CreateAllocatingVlanPoolForm: FC<Props> = ({
  onFormSubmit,
  resourceTypeId,
  allocationStrategyId,
  possibleParentPools,
}) => {
  const { selectedTags, handleOnSelectionChange, handleTagCreation } = useTagsInput();
  const [isNested, setIsNested] = useState(false);
  const [poolSchema, setPoolSchema] = useState(getPoolSchema(isNested));

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: poolSchema,
    onSubmit: (data) => {
      onFormSubmit(
        {
          ...data,
          resourceTypeId,
          allocationStrategyId,
          tags: selectedTags.map((tag) => tag.label),
        },
        isNested,
      );
    },
  });

  useEffect(() => {
    setPoolSchema(getPoolSchema(isNested));
  }, [isNested]);

  const handlePoolPropertiesChange = useCallback(
    (pProperties) => {
      setFieldValue('poolProperties', { ...values.poolProperties, [pProperties.key]: pProperties.value });
      setFieldValue('poolPropertyTypes', { ...values.poolPropertyTypes, [pProperties.key]: pProperties.type });
    },
    [setFieldValue, values],
  );

  return (
    <form onSubmit={handleSubmit}>
      {possibleParentPools && (
        <HStack spacing={4} marginY={5}>
          <FormControl id="isNested">
            <FormLabel>Nested</FormLabel>
            <Switch onChange={() => setIsNested(!isNested)} name="isNested" isChecked={isNested} />
          </FormControl>
          {isNested && (
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
                    {pool.Name}
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
      <FormControl marginY={5}>
        <SearchByTagInput
          onSelectionChange={handleOnSelectionChange}
          selectedTags={selectedTags}
          onTagCreate={handleTagCreation}
        />
      </FormControl>
      <FormControl
        id="poolDealocationSafetyPeriod"
        marginY={5}
        isInvalid={errors.poolDealocationSafetyPeriod !== undefined}
      >
        <FormLabel>Pool dealocation safety period</FormLabel>
        <Input
          type="number"
          value={values.poolDealocationSafetyPeriod}
          onChange={handleChange}
          name="poolDealocationSafetyPeriod"
          placeholder="Enter dealocation safety period"
        />
        <FormErrorMessage>{errors.poolDealocationSafetyPeriod}</FormErrorMessage>
      </FormControl>
      <Divider marginY={5} orientation="horizontal" color="gray.200" />
      {!isNested && (
        <>
          <Box>
            <Heading as="h4" size="md">
              Set pool properties
            </Heading>
            <PoolPropertiesForm
              poolProperties={values.poolProperties as Record<string, string>}
              poolPropertyTypes={values.poolPropertyTypes as Record<string, 'int'>}
              onChange={handlePoolPropertiesChange}
            />
            <FormErrorMessage>{errors.poolProperties}</FormErrorMessage>
          </Box>
          <Divider marginY={5} orientation="horizontal" color="gray.200" />
        </>
      )}
      <Button type="submit" colorScheme="blue">
        Create pool
      </Button>
    </form>
  );
};

export default CreateAllocatingVlanPoolForm;
