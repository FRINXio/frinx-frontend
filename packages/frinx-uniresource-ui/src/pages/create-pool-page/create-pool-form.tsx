import React, { useCallback, VoidFunctionComponent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { omit } from 'lodash';
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
  Icon,
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
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import PoolValuesForm from './pool-values-form';
import SearchByTagInput from '../../components/search-by-tag-input';
import { useTagsInput } from '../../hooks/use-tags-input';
import { SelectPoolsQuery, SelectResourceTypesQuery } from '../../__generated__/graphql';
import {
  getAvailableAllocatedResources,
  getAvailablePoolProperties,
  getAvailableResourceTypes,
  deriveResourceTypesFromAvailableResourceTypes,
  formatSuggestedProperties,
} from '../../helpers/create-pool-form.helpers';

type PoolType = 'set' | 'allocating' | 'singleton';
export type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  resourceTypeName: string;
  tags: string[];
  allocationStrategyId?: string;
  dealocationSafetyPeriod?: number;
  poolType: PoolType;
  poolValues: Record<string, string>[];
  isNested: boolean;
  parentPoolId?: string;
  parentResourceId?: string;
};

const getInitialValues = (url: string, resourceTypes: SelectResourceTypesQuery['QueryResourceTypes']): FormValues => {
  const query = new URLSearchParams(url);

  return {
    name: '',
    description: '',
    dealocationSafetyPeriod: 0,
    resourceTypeId: resourceTypes.find(({ Name }) => Name === 'ipv4')?.id || '',
    resourceTypeName: 'ipv4',
    isNested: !!query.get('isNested') || false,
    poolType: 'allocating',
    poolValues: [],
    parentPoolId: query.get('parentPoolId') || undefined,
    parentResourceId: undefined,
    allocationStrategyId: '',
    tags: [],
  };
};

function getSchemaForPoolValues(
  poolValues: Record<string, string>[],
  options: { isIpv6?: boolean; isIpv4?: boolean } = { isIpv4: false, isIpv6: false },
) {
  const ipv4Regex = /(^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$)/;
  const ipv6Regex =
    /(^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$)/;
  return yup.array().of(
    yup.object().shape({
      ...Object.keys(poolValues[0] ?? {}).reduce((acc, key) => {
        if (key === 'address') {
          return {
            ...acc,
            [key]: yup
              .string()
              .matches(
                options.isIpv4 ? ipv4Regex : ipv6Regex,
                `Please enter a valid ${options.isIpv4 ? 'IPv4' : 'IPv6'} address`,
              )
              .required(`Please enter an ${options.isIpv4 ? 'IPv4' : 'IPv6'} address`),
          };
        } else {
          return {
            ...acc,
            [key]: yup.string().required('Please enter a value'),
          };
        }
      }, {}),
    }),
  );
}

type AllocStrategy = {
  id: string;
  name: string;
};

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
        tags: yup.array().of(yup.string()).notRequired(),
        dealocationSafetyPeriod: yup
          .number()
          .min(0, 'Please enter positive number')
          .required('Please enter a dealocation safety period')
          .typeError('Please enter a number'),
        poolValues: yup.lazy((poolValues: Array<Record<string, string>>) => {
          return yup
            .array()
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'ipv4' || resourceTypeName === 'ipv4_prefix',
              then: getSchemaForPoolValues(poolValues, { isIpv4: true }),
            })
            .when('resourceTypeName', {
              is: (resourceTypeName: string) => resourceTypeName === 'ipv6' || resourceTypeName === 'ipv6_prefix',
              then: getSchemaForPoolValues(poolValues, { isIpv6: true }),
              otherwise: yup.array().of(
                yup.object().shape({
                  ...Object.keys(poolValues[0] ?? {}).reduce(
                    (acc, key) => ({ ...acc, [key]: yup.string().required('Please enter a value') }),
                    {},
                  ),
                }),
              ),
            })
            .min(1, 'Please enter at least one value');
        }),
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
  const { selectedTags, handleTagCreation, handleOnSelectionChange } = useTagsInput();
  const advancedOptionsDisclosure = useDisclosure();
  const [poolSchema, setPoolSchema] = useState(
    getSchema(
      getInitialValues(window.location.search, resourceTypes).poolType,
      getInitialValues(window.location.search, resourceTypes).isNested,
    ),
  );
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors } = useFormik<FormValues>({
    initialValues: getInitialValues(window.location.search, resourceTypes),
    validationSchema: poolSchema,
    validateOnChange: false,
    onSubmit: async (data) => {
      const resourceTypeName = resourceTypes.find((resourceType) => resourceType.id === data.resourceTypeId)?.Name;
      const allocationStratedyId = allocStrategies.find(
        (allocationStrategy) => allocationStrategy.name === resourceTypeName,
      )?.id;
      const updatedData = {
        ...omit(data, ['resourceTypeName']),
        tags: [...selectedTags, data.name],
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

  useEffect(() => {
    setPoolSchema(getSchema(values.poolType, isNested));
    if (!isNested) {
      setFieldValue('parentPoolId', '');
      setFieldValue('parentResourceId', '');
    }
  }, [isNested, values.poolType, setFieldValue]);

  const { QueryResourcePools: pools } = resourcePools;
  const resourceTypeName = resourceTypes.find((rt) => rt.id === resourceTypeId)?.Name ?? 'ipv4';
  const parentResourceTypeName = pools.find((pool) => pool.id === parentPoolId)?.ResourceType.Name ?? null;
  const availableResourceTypes = getAvailableResourceTypes(resourceTypes, pools, parentPoolId);
  const availableAllocatedResources = getAvailableAllocatedResources(pools, parentPoolId);
  const derivedFromAvailableResourceTypes = deriveResourceTypesFromAvailableResourceTypes(
    resourceTypes,
    availableResourceTypes,
  );
  const availablePoolProperties = getAvailablePoolProperties(resourcePools, parentPoolId, parentResourceId);
  const formattedSuggestedProperties = formatSuggestedProperties(parentResourceTypeName, availablePoolProperties);

  const handleOnResourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    setFieldValue(
      'resourceTypeName',
      [...availableResourceTypes, ...derivedFromAvailableResourceTypes].find((rt) => rt.id === e.target.value)?.Name,
    );
  };

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
        <FormControl id="resourceTypeId" isInvalid={errors.resourceTypeId !== undefined} isRequired>
          <FormLabel>Resource type</FormLabel>
          <Select
            name="resourceTypeId"
            value={resourceTypeId}
            onChange={handleOnResourceTypeChange}
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
        <FormControl id="name" marginY={5} isInvalid={errors.name !== undefined} isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" onChange={handleChange} name="name" value={values.name} placeholder="Enter name" />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
      </HStack>
      <Divider marginY={5} orientation="horizontal" color="gray.200" />
      <PoolValuesForm
        onChange={handleFormValuesChange}
        resourceTypeName={resourceTypeName}
        existingPoolValues={values.poolValues}
        poolValuesErrors={errors.poolValues}
      >
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
      </PoolValuesForm>
      <HStack onClick={advancedOptionsDisclosure.onToggle} cursor="pointer">
        <Divider />
        <HStack>
          <Text width="max-content" textColor="gray.400">
            Advanced options
          </Text>
          <Icon
            as={advancedOptionsDisclosure.isOpen ? ChevronUpIcon : ChevronDownIcon}
            fontSize="2xl"
            color="gray.400"
          />
        </HStack>
        <Divider />
      </HStack>
      {advancedOptionsDisclosure.isOpen && (
        <Box>
          <HStack>
            {values.poolType !== 'singleton' && (
              <FormControl id="dealocationSafetyPeriod" my={2} isInvalid={errors.dealocationSafetyPeriod !== undefined}>
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
            <FormControl id="poolType" my={2}>
              <FormLabel>Pool type</FormLabel>
              <Select name="poolType" value={poolType} onChange={handleChange}>
                {['set', 'allocating', 'singleton'].map((o) => (
                  <option value={o} key={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
          <FormControl mt={2}>
            <SearchByTagInput
              selectedTags={selectedTags}
              onTagCreate={handleTagCreation}
              onSelectionChange={handleOnSelectionChange}
            />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Descripton</FormLabel>
            <Textarea
              onChange={handleChange}
              name="description"
              value={values.description}
              placeholder="Enter description"
            />
          </FormControl>
        </Box>
      )}
      <HStack mt={4}>
        <Spacer />
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create pool
        </Button>
      </HStack>
    </form>
  );
};

export default CreatePoolForm;
