import React, { FC, VoidFunctionComponent } from 'react';
import { Box, Heading, Text, Flex, Icon, LinkOverlay } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

type Props = {
  label: string;
  description: string;
  icon: string;
  path: string;
  isLinkExternal?: boolean;
};

const LinkOverlayComponent: FC<{ isLinkExternal?: boolean; path: string }> = ({ isLinkExternal, path, children }) => {
  if (isLinkExternal) {
    return (
      <LinkOverlay as="a" href={path}>
        {children}
      </LinkOverlay>
    );
  }
  return (
    <LinkOverlay as={RouterLink} to={path}>
      {children}
    </LinkOverlay>
  );
};

const Panel: VoidFunctionComponent<Props> = ({ path, label, description, icon, isLinkExternal }) => {
  return (
    <Flex
      as={Box}
      // maxW="sm"
      width="sm"
      padding={4}
      rounded="md"
      _hover={{
        boxShadow: 'sm',
        background: 'white',
      }}
      position="relative"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Flex
        width={12}
        height={12}
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        boxShadow="inner"
        background="brand.100"
        fontSize="24px"
      >
        <Icon as={FeatherIcon} icon={icon} color="brand.700" size={24} />
      </Flex>
      <Box marginLeft={4}>
        <Heading size="md" as="h2" marginBottom={1}>
          <LinkOverlayComponent isLinkExternal={isLinkExternal} path={path}>
            {label}
          </LinkOverlayComponent>
        </Heading>
        <Text fontSize="sm">{description}</Text>
      </Box>
    </Flex>
  );
};

export default Panel;
