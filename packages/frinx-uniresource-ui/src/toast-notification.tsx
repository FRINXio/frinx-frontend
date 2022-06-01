import { Heading, Flex, keyframes, Icon, Box } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { FC, useState, useEffect, useRef } from 'react';

const DEFAULT_TIMEOUT_DISMISS = 3500; // defatul timeout in which notification will automatically dismiss (ms)

const slideIn = keyframes`
  from {
    right: -500px;
  }
  to {
    right: 0;
  }
`;
const slideOut = keyframes`
  from {
    right: 0;
  }
  to {
    right: -500px;
  }
`;

type NotificationType = 'warning' | 'error' | 'info' | 'success';
type Props = {
  type: NotificationType;
  title?: string;
  timeout?: number;
  isVisible: boolean;
  onClose: () => void;
  onAnimationEnd: () => void;
  index: number;
};

const getToastBackground = (type: NotificationType): string => {
  switch (type) {
    case 'error':
      return 'red.400';
    case 'success':
      return 'green.400';
    case 'warning':
      return 'yellow.400';
    case 'info':
    default:
      return 'blue.400';
  }
};

const getToastIcon = (type: NotificationType): React.ReactNode => {
  switch (type) {
    case 'success':
      return <Icon as={FeatherIcon} icon="check-circle" size={24} color="white" />;
    case 'error':
      return <Icon as={FeatherIcon} icon="x-circle" size={24} color="white" />;
    case 'warning':
      return <Icon as={FeatherIcon} icon="alert-circle" size={24} color="white" />;
    case 'info':
      return <Icon as={FeatherIcon} icon="activity" size={24} color="white" />;
    default:
      throw new Error('wrong type');
  }
};

const ToastNotification: FC<Props> = ({
  isVisible,
  onClose,
  timeout = DEFAULT_TIMEOUT_DISMISS,
  type,
  title,
  children,
  index,
  onAnimationEnd,
}) => {
  const [isRendered, setRendered] = useState(isVisible);
  const timeoutID = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setRendered(true);
      timeoutID.current = setTimeout(() => {
        onClose();
      }, timeout);
    }

    return () => {
      if (timeoutID.current != null) {
        clearTimeout(timeoutID.current);
      }
      timeoutID.current = null;
    };
  }, [isVisible, onClose, timeout]);

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setRendered(false);
      onAnimationEnd();
    }
  };

  return isRendered ? (
    <Flex
      alignItems="center"
      animation={`${isVisible ? slideIn : slideOut} 0.4s ease-out`}
      onAnimationEnd={handleAnimationEnd}
      background={getToastBackground(type)}
      color="whiteAlpha.900"
      borderRadius="md"
      boxShadow="md"
      paddingX={4}
      paddingY={2}
      width={96}
      minHeight={20}
      position="fixed"
      top="70px"
      right="20px"
      transform={`translateY(${index * 95}px)`}
      zIndex="modal"
    >
      <Box>
        <Flex
          justifyContent="center"
          alignItems="center"
          borderRadius="50%"
          width={12}
          height={12}
          background="blackAlpha.200"
        >
          {getToastIcon(type)}
        </Flex>
      </Box>
      <Box marginLeft={4}>
        {title && (
          <Heading as="h4" size="sm">
            {title}
          </Heading>
        )}
        {children}
      </Box>
      <Flex
        as="button"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top={4}
        right={4}
        onClick={(event) => {
          event.stopPropagation();
          if (timeoutID.current != null) {
            clearTimeout(timeoutID.current);
          }
          timeoutID.current = null;
          onClose();
        }}
      >
        <Icon as={FeatherIcon} icon="x" size={20} />
      </Flex>
    </Flex>
  ) : null;
};

export default ToastNotification;
