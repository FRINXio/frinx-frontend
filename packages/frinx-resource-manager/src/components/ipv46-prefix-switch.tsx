import { Flex, FormControl, Heading, Switch, Text } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, VoidFunctionComponent } from 'react';

type Props = {
  isIpv4: boolean;
  setIsIpv4: Dispatch<SetStateAction<boolean>>;
  clearAllTags: () => void;
  firstPage: () => void;
};

const Ipv46PrefixSwitch: VoidFunctionComponent<Props> = ({ isIpv4, setIsIpv4, clearAllTags, firstPage }) => {
  const handleSwitch = () => {
    clearAllTags();
    setIsIpv4((prevState) => !prevState);
    firstPage();
  };
  return (
    <FormControl mb={5}>
      <Flex align="center">
        <Heading as="h5" size="md">
          Select resource type:{' '}
        </Heading>
        {!isIpv4 ? (
          <Text align="center" color="blue.300" fontWeight="bold" ml={3}>
            Ipv6_prefix
          </Text>
        ) : (
          <Text align="center" ml={3}>
            Ipv6_prefix
          </Text>
        )}
        <Switch
          size="md"
          mx={5}
          onChange={handleSwitch}
          data-cy="ipv4-ipv6-switch"
          name="isNested"
          isChecked={isIpv4}
        />
        {isIpv4 ? (
          <Text align="center" fontWeight="bold" color="blue.300">
            Ipv4_prefix
          </Text>
        ) : (
          <Text align="center">Ipv4_prefix</Text>
        )}
      </Flex>
    </FormControl>
  );
};

export default Ipv46PrefixSwitch;
