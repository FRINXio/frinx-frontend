import { Box, Flex, Text, Theme, useTheme } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Position, Handle, NodeProps } from 'react-flow-renderer';
import { StartTask, EndTask } from '../../helpers/types';

type Props = NodeProps<{
  type: string;
  label: string;
  handles: string[];
  task: StartTask | EndTask;
}>;

const StartEndNode: VoidFunctionComponent<Props> = memo(({ type }) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      background="white"
      width={20}
      height={20}
      borderWidth={4}
      borderStyle="solid"
      overflow="hidden"
      borderRadius="50%"
      borderColor={type === 'start' ? 'green.100' : 'red.100'}
    >
      <Box padding={2} fontSize="sm" fontWeight={600} textAlign="center">
        <Text textTransform="uppercase">{type}</Text>
      </Box>
      {type === 'start' && (
        <Flex
          background={theme.colors.gray[200]}
          width={theme.space[12]}
          height={theme.space[6]}
          marginLeft="auto"
          alignItems="center"
          justifyContent="center"
        >
          <Handle
            type="source"
            position={Position.Right}
            style={{
              position: 'static',
              top: 0,
              right: 0,
              transform: 'none',
              border: 0,
              width: '100%',
              display: 'flex',
              background: theme.colors.gray[200],
              color: theme.colors.gray[700],
              fontSize: theme.fontSizes.xs,
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
            }}
          >
            out
          </Handle>
        </Flex>
      )}
      {type === 'end' && (
        <Flex
          background={theme.colors.gray[200]}
          width={theme.space[12]}
          height={theme.space[6]}
          marginRight="auto"
          alignItems="center"
          justifyContent="center"
        >
          <Handle
            type="target"
            position={Position.Left}
            style={{
              position: 'static',
              top: 0,
              left: 0,
              transform: 'none',
              background: theme.colors.gray[200],
              width: theme.space[12],
              border: 0,
              fontSize: theme.fontSizes.xs,
              color: theme.colors.gray[700],
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
            }}
          >
            in
          </Handle>
        </Flex>
      )}
    </Box>
  );
});

export default StartEndNode;
