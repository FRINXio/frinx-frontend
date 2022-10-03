import { Box, Flex, Text } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Position, Handle, NodeProps } from 'react-flow-renderer';
import { StartTask, EndTask } from '../../../helpers/types';

type Props = NodeProps<{
  type: string;
  label: string;
  handles: string[];
  task: StartTask | EndTask;
}>;

const StartEndNode: VoidFunctionComponent<Props> = memo(({ type }) => {
  return (
    <Flex width="300px" justifyContent="center">
      <Box
        background="white"
        width={20}
        height={20}
        borderWidth={1}
        borderStyle="solid"
        overflow="hidden"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box padding={2} fontSize="sm" textAlign="center">
          <Text textTransform="uppercase">{type}</Text>
        </Box>
        {type === 'start' && <Handle type="source" position={Position.Bottom} />}
        {type === 'end' && <Handle type="target" position={Position.Top} />}
      </Box>
    </Flex>
  );
});

export default StartEndNode;
