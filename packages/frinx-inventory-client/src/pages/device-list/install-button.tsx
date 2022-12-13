import { CircularProgress, Flex, Icon, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';

type Props = {
  isInstalled: boolean;
  isLoading: boolean;
  onInstalClick: () => void;
  onUninstallClick: () => void;
  deviceName: string;
};

type ButtonIconProps = {
  icon: string;
  color: string;
  isLoading: boolean;
  deviceName: string;
};

const ButtonIcon: VoidFunctionComponent<ButtonIconProps> = ({ icon, color, isLoading, deviceName }) => {
  return (
    <Flex
      data-cy={`deviceInstall-${deviceName}`}
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
  onInstalClick,
  onUninstallClick,
  deviceName,
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
        onClick={onUninstallClick}
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
            <ButtonIcon deviceName={deviceName} icon="arrow-down" color="yellow.500" isLoading={isLoading} />
            <Text size="sm" fontWeight={600} as="span" marginLeft={4}>
              Uninstall
            </Text>
          </>
        ) : (
          <>
            <ButtonIcon deviceName={deviceName} icon="check" color="green.500" isLoading={isLoading} />
            <Text size="sm" fontWeight={600} as="span" marginLeft={4}>
              Installed
            </Text>
          </>
        )}
      </Flex>
    );
  }

  return (
    <Flex
      {...baseStyles}
      onClick={onInstalClick}
      _hover={{
        backgroundColor: 'blue.500',
      }}
      disabled={isLoading}
    >
      <ButtonIcon deviceName={deviceName} icon="arrow-up" color="blue.400" isLoading={isLoading} />
      <Text size="sm" fontWeight={600} as="span" flex={1}>
        {isLoading ? '...' : 'Install'}
      </Text>
    </Flex>
  );
};

export default InstallButton;
