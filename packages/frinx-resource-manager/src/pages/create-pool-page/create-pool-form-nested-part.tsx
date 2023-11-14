import { HStack, FormControl, FormLabel, Select, FormErrorMessage } from '@chakra-ui/react';
import { FormikErrors, FormikHandlers } from 'formik';
import React, { VoidFunctionComponent } from 'react';
import { AvailableAllocatedResource, isSpecificResourceTypeName } from '../../helpers/create-pool-form.helpers';
import { SelectPoolsQuery } from '../../__generated__/graphql';
import { FormValues } from './create-pool-form';

type Props = {
  errors: FormikErrors<FormValues>;
  pools: SelectPoolsQuery | undefined;
  parentPoolId?: string;
  parentResourceId?: string;
  handleChange: FormikHandlers['handleChange'];
  availableAllocatedResources: AvailableAllocatedResource[] | undefined;
};

const CreatePoolFormNestedPart: VoidFunctionComponent<Props> = ({
  errors,
  pools,
  parentPoolId,
  handleChange,
  availableAllocatedResources,
  parentResourceId,
}) => {
  const poolsData = pools?.resourceManager.QueryRootResourcePools.edges.map((e) => {
    return e?.node;
  });
  return (
    <HStack spacing={2} marginY={5}>
      <FormControl id="parentPoolId" isInvalid={errors.parentPoolId !== undefined} isRequired>
        <FormLabel htmlFor="parentPool">Parent pool</FormLabel>
        <Select
          data-cy="create-pool-parent"
          id="parentPool"
          name="parentPoolId"
          onChange={handleChange}
          value={parentPoolId}
          placeholder="Select parent resource type"
        >
          {poolsData
            ?.filter(
              (pool) =>
                pool !== undefined &&
                isSpecificResourceTypeName(pool.ResourceType.Name, [
                  'ipv4_prefix',
                  'ipv6_prefix',
                  'vlan_range',
                  'route_distinguisher',
                ]),
            )
            .map((pool) => (
              <option value={pool?.id} key={pool?.id}>
                {pool?.Name}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{errors.parentPoolId}</FormErrorMessage>
      </FormControl>

      <FormControl id="parentResourceId" isInvalid={errors.parentResourceId !== undefined} isRequired>
        <FormLabel htmlFor="parentResource">Parent allocated resources</FormLabel>
        <Select
          data-cy="create-pool-allocated-resources"
          id="parentResource"
          name="parentResourceId"
          onChange={handleChange}
          value={parentResourceId}
          placeholder="Select parent resource type"
        >
          {availableAllocatedResources?.map((pool) => (
            <option value={pool?.id} key={pool?.id}>
              {pool?.Name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.parentResourceId}</FormErrorMessage>
      </FormControl>
    </HStack>
  );
};

export default CreatePoolFormNestedPart;
