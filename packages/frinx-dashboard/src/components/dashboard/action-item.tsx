import { Box, Flex, Heading, Icon, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  title: string;
  text: string;
  buttonText: string;
  icon: string;
};

const ActionItem: VoidFunctionComponent<Props> = ({ buttonText, text, title, to, icon }) => {
  return (
    <LinkBox as={Flex} flex={1}>
      <LinkOverlay
        as={Link}
        to={to}
        flex={1}
        padding={6}
        borderRadius="lg"
        background="whiteAlpha.800"
        color="blackAlpha.800"
        boxShadow="md"
        transition="all .2s ease-in-out"
        borderStyle="solid"
        borderWidth={2}
        borderColor="transparent"
        display="flex"
        flexDirection="row"
        alignItems="stretch"
        _hover={{
          background: 'whiteAlpha.900',
          color: 'blackAlpha.900',
          boxShadow: 'lg',
          borderColor: 'blue.500',
          span: {
            svg: {
              transform: 'translate3d(5px, 0, 0)',
            },
          },
        }}
      >
        <Box>
          <FeatherIcon icon={icon} size="32px" />
        </Box>
        <Box marginLeft={4}>
          <Heading as="h3" size="md" marginBottom={2} fontWeight={700}>
            {title}
          </Heading>
          <Text marginBottom={8}>{text}</Text>
          <Text
            variant="unstyled"
            as="span"
            display="inline-flex"
            position="relative"
            alignItems="center"
            fontWeight={600}
            marginTop="auto"
          >
            {buttonText}
            <Icon as={FeatherIcon} icon="arrow-right" marginLeft={2} transition="all .2s ease-in-out" />
          </Text>
        </Box>
      </LinkOverlay>
    </LinkBox>
  );
};

export default ActionItem;
