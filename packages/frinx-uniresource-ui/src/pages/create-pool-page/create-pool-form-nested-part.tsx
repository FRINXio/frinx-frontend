import { HStack, FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react';
import { FormikErrors, FormikHandlers } from 'formik';
import React, { VoidFunctionComponent } from 'react';
import { AvailableAllocatedResource, canSelectCustomResourceTypes } from '../../helpers/create-pool-form.helpers';
import { SelectPoolsQuery } from '../../__generated__/graphql';
import { FormValues } from './create-pool-form';

type Props = {
  errors: FormikErrors<FormValues>;
  pools: SelectPoolsQuery['QueryResourcePools'];
  parentPoolId?: string;
  parentResourceId?: string;
  handleChange: FormikHandlers['handleChange'];
  availableAllocatedResources: AvailableAllocatedResource[];
};

const CreatePoolFormNestedPart: VoidFunctionComponent<Props> = ({
  errors,
  pools,
  parentPoolId,
  handleChange,
  availableAllocatedResources,
  parentResourceId,
}) => {
  return (
    <HStack spacing={2} marginY={5}>
      <FormControl id="parentPoolId" isInvalid={errors.parentPoolId !== undefined} isRequired>
        <FormLabel htmlFor="parentPool">Parent pool</FormLabel>
        <Select
          id="parentPool"
          name="parentPoolId"
          onChange={handleChange}
          value={parentPoolId}
          placeholder="Select parent resource type"
        >
          {pools
            .filter(
              (pool) =>
                pool.Resources.length > 0 &&
                canSelectCustomResourceTypes(pool.ResourceType.Name, [
                  'ipv4_prefix',
                  'ipv6_prefix',
                  'vlan_range',
                  'route_distinguisher',
                ]),
            )
            .map((pool) => (
              <option value={pool.id} key={pool.id}>
                {pool.Name}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{errors.parentPoolId}</FormErrorMessage>
      </FormControl>

      <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined} isRequired>
        <FormLabel htmlFor="parentResource">Parent allocated resources</FormLabel>
        <Select
          id="parentResource"
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
  );
};

export default CreatePoolFormNestedPart;
