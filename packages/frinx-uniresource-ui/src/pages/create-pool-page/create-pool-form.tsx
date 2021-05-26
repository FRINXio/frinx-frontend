import React, { VoidFunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Switch,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from '@chakra-ui/react';

type PoolType = 'set' | 'allocating' | 'singleton';
type FormValues = {
  name: string;
  description: string;
  resourceTypeId: string;
  poolType: PoolType;
} & (
  | {
      poolType: 'allocating';
      dealocationSafetyPeriod: number;
      allocationStrategyId: string;
      poolProperties: Record<string, string>[];
    }
  | { poolType: 'set'; dealocationSafetyPeriod: number; poolValues: Record<string, string>[] }
  | { poolType: 'singleton'; poolValues: Record<string, string>[] }
) &
  (
    | {
        isNested: true;
        parentResourceId: string;
      }
    | { isNested: false; parentResourceId: undefined }
  );

const INITIAL_VALUES: FormValues = {
  name: '',
  description: '',
  dealocationSafetyPeriod: 0,
  resourceTypeId: '',
  isNested: false,
  poolType: 'set',
  poolValues: [],
  parentResourceId: undefined,
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

const CreatePoolForm: VoidFunctionComponent<Props> = ({ onFormSubmit, resourceTypes, pools, allocStrategies }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: INITIAL_VALUES,
  });
  const isNested = watch('isNested');
  const poolType = watch('poolType');

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onFormSubmit(values);
      })}
    >
      <FormControl id="poolType">
        <FormLabel>Pool type</FormLabel>
        <Select {...register('poolType')}>
          {['set', 'allocating', 'singleton'].map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </Select>
      </FormControl>
      <HStack spacing={4} marginY={5}>
        <FormControl id="isNested">
          <FormLabel>Nested</FormLabel>
          <Switch {...register('isNested')} />
        </FormControl>
        {isNested && (
          <FormControl id="parentResourceId">
            <FormLabel>Parent pool</FormLabel>
            <Select {...register('parentResourceId')}>
              <option value="" disabled>
                Select parent pool
              </option>
              {pools.map((pool) => (
                <option value={pool.id} key={pool.id}>
                  {pool.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      </HStack>
      <FormControl id="name" marginY={5}>
        <FormLabel>Name</FormLabel>
        <Input type="text" {...register('name')} placeholder="Enter name" />
      </FormControl>
      <FormControl id="description" marginY={5}>
        <FormLabel>Descripton</FormLabel>
        <Input type="text" {...register('description')} placeholder="Enter description" />
      </FormControl>
      <FormControl id="resourceTypeId" marginY={5}>
        <FormLabel>Resource type</FormLabel>
        <Select {...register('resourceTypeId')}>
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
      {poolType !== 'singleton' && (
        <FormControl id="dealocationSafetyPeriod" marginY={5}>
          <FormLabel>Dealocation safety period</FormLabel>
          <Input type="text" {...register('dealocationSafetyPeriod')} placeholder="Enter dealocation safety period" />
        </FormControl>
      )}
      {poolType === 'allocating' && (
        <FormControl id="allocationStrategyId" marginY={5}>
          <FormLabel>Allocation strategy</FormLabel>
          <Select {...register('allocationStrategyId')}>
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
      <FormControl>
        <Button type="submit" colorScheme="blue">
          Create pool
        </Button>
      </FormControl>
    </form>
  );
};

export default CreatePoolForm;
