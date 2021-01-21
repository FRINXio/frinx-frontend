import React, { FC } from 'react';
import { Box, Heading, Text, Link, Flex, Icon, WrapItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type Props = {
  label: string;
  description: string;
  icon: IconDefinition;
  path: string;
};

const Panel: FC<Props> = (props) => {
  const { path, label, description, icon } = props;

  return (
    <WrapItem
      padding={4}
      alignItems="flex-start"
      boxShadow="base"
      background="white"
      borderRadius="md"
      _hover={{
        boxShadow: 'md',
      }}
      width={72}
    >
      <Flex
        width={12}
        height={12}
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        boxShadow="inner"
        background="brand.100"
      >
        <Icon as={FontAwesomeIcon} icon={icon} color="brand.700" />
      </Flex>
      <Box paddingLeft={4} flex={1}>
        <Heading size="md" as="h2" marginBottom={1}>
          <Link
            to={path}
            as={RouterLink}
            _hover={{
              textDecor: 'underline',
            }}
          >
            {label}
          </Link>
        </Heading>
        <Text fontSize="sm">{description}</Text>
      </Box>
    </WrapItem>
  );
};

export default Panel;
