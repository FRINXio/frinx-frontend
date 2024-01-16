import { Heading, VStack, Text, Box } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  additionalInfo: Record<string, string | number | null>;
};

function camelCaseToSentence(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
}

const DeviceInfoPanelAdditionalInfo: VoidFunctionComponent<Props> = ({ additionalInfo }) => {
  const details: [string, string | number | null][] = Object.entries(additionalInfo).map(([key, value]) => [
    camelCaseToSentence(key),
    value,
  ]);

  const detailsWithoutTypename = details.filter(([key]) => key !== '__typename');

  return (
    <VStack spacing={2} align="flex-start" mx={5}>
      {detailsWithoutTypename.map(([key, value]) => (
        <Box>
          <Heading as="h4" fontSize="xs">
            {key}
          </Heading>
          <Text fontSize="xs" textColor="GrayText">
            {value || 'N/A'}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};

export default DeviceInfoPanelAdditionalInfo;
