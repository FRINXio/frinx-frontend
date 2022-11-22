import {
  HStack,
  Divider,
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  FormErrorMessage,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { FormikErrors, FormikHandlers } from 'formik';
import { FormValues } from './create-pool-form';
import { PoolType } from '../../__generated__/graphql';

type Props = {
  poolPropertiesErrors: FormikErrors<FormValues>;
  poolType: PoolType;
  values: FormValues;
  handleChange: FormikHandlers['handleChange'];
};

const CreatePoolFormAdvancedOptions: VoidFunctionComponent<Props> = ({
  poolPropertiesErrors,
  poolType,
  values,
  handleChange,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <HStack my={3}>
        <Divider />
        <HStack cursor="pointer" textColor="gray.500" onClick={onToggle}>
          <Text width="max-content">Advanced options</Text>
          {isOpen ? <FeatherIcon icon="chevron-up" size={20} /> : <FeatherIcon icon="chevron-down" size={20} />}
        </HStack>
        <Divider />
      </HStack>
      {isOpen && (
        <Box>
          <HStack>
            <FormControl id="poolType">
              <FormLabel htmlFor="poolTypeName">Pool type</FormLabel>
              <Select id="poolTypeName" name="poolType" value={poolType} onChange={handleChange}>
                {['set', 'allocating', 'singleton'].map((o) => (
                  <option value={o} key={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </FormControl>
            {values.poolType !== 'singleton' && (
              <FormControl
                id="dealocationSafetyPeriod"
                isInvalid={poolPropertiesErrors.dealocationSafetyPeriod !== undefined}
              >
                <FormLabel htmlFor="dealocationPeriod">Dealocation safety period</FormLabel>
                <Input
                  id="dealocationPeriod"
                  type="text"
                  onChange={handleChange}
                  name="dealocationSafetyPeriod"
                  value={values.dealocationSafetyPeriod}
                  placeholder="Enter dealocation safety period"
                />
                <FormErrorMessage>{poolPropertiesErrors.dealocationSafetyPeriod}</FormErrorMessage>
              </FormControl>
            )}
          </HStack>
        </Box>
      )}
    </>
  );
};

export default CreatePoolFormAdvancedOptions;
