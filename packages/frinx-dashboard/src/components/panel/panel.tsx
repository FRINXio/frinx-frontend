import React, { CSSProperties, FC, useState } from 'react';
import { Box, Heading, Text, Link, Flex, Icon, WrapItem } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type Props = {
  title: string;
  description: string;
  icon: IconDefinition;
  style: CSSProperties;
  url: string | undefined;
  isExternal: boolean;
  isDisabled: boolean;
};

const Panel: FC<Props> = props => {
  const { url, isExternal, title, description, icon } = props;

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
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            _hover={{
              textDecor: 'underline',
            }}
          >
            {title}
          </Link>
        </Heading>
        <Text fontSize="sm">{description}</Text>
      </Box>
    </WrapItem>
  );
};

export default Panel;
