import { CircularProgress, Flex, Icon, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';

type Props = {
  isInstalled: boolean;
  isLoading: boolean;
  onActivateClick: () => void;
  onDeactivateClick: () => void;
  streamName: string;
};

type ButtonIconProps = {
  icon: string;
  color: string;
  isLoading: boolean;
  streamName: string;
};

const ButtonIcon: VoidFunctionComponent<ButtonIconProps> = ({ icon, color, isLoading, streamName }) => {
  return (
    <Flex
      data-cy={`stream-install-${streamName}`}
      justifyContent="center"
      alignItems="center"
      borderRadius="50%"
      width="18px"
      height="18px"
      background={isLoading ? 'transparent' : 'white'}
    >
      {isLoading ? (
        <CircularProgress size="18px" isIndeterminate />
      ) : (
        <Icon transform="translateY(1px)" as={FeatherIcon} size={16} icon={icon} color={color} />
      )}
    </Flex>
  );
};

const InstallButton: VoidFunctionComponent<Props> = ({
  isInstalled,
  isLoading,
  onActivateClick,
  onDeactivateClick,
  streamName,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyles = {
    alignItems: 'center',
    paddingX: '5px',
    as: 'button',
    cursor: 'pointer',
    type: 'button',
    borderRadius: 50,
    height: 8,
    width: 32,
    backgroundColor: isInstalled ? 'green.500' : 'blue.400',
    color: 'whiteAlpha.900',
    pointerEvents: isLoading ? 'none' : 'all',
    opacity: isLoading ? 0.7 : 1,
  } as const;

  if (isInstalled) {
    return (
      <Flex
        {...baseStyles}
        onClick={onDeactivateClick}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        _hover={{
          backgroundColor: 'yellow.400',
          color: 'yellow.800',
        }}
      >
        {isHovered ? (
          <>
            <ButtonIcon streamName={streamName} icon="arrow-down" color="yellow.500" isLoading={isLoading} />
            <Text size="sm" fontWeight={600} as="span" marginLeft={4}>
              Deactivate
            </Text>
          </>
        ) : (
          <>
            <ButtonIcon streamName={streamName} icon="check" color="green.500" isLoading={isLoading} />
            <Text size="sm" fontWeight={600} as="span" marginLeft={4}>
              Active
            </Text>
          </>
        )}
      </Flex>
    );
  }

  return (
    <Flex
      {...baseStyles}
      onClick={onActivateClick}
      _hover={{
        backgroundColor: 'blue.500',
      }}
      disabled={isLoading}
    >
      <ButtonIcon streamName={streamName} icon="arrow-up" color="blue.400" isLoading={isLoading} />
      <Text size="sm" fontWeight={600} as="span" flex={1}>
        {isLoading ? '...' : 'Activate'}
      </Text>
    </Flex>
  );
};

export default InstallButton;
