import React, { FC } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useTheme,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import { CustomNodeType } from '../../helpers/types';
import { getNodeColor } from './nodes.helpers';
import unwrap from '../../helpers/unwrap';
import { useTaskActions } from '../../task-actions-context';

const TaskNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, data } = props;
  const { selectTask, selectedTask, setRemovedTaskId } = useTaskActions();
  const theme = useTheme();
  const { task } = unwrap(data);

  return (
    <Box
      background="white"
      width={60}
      borderWidth={2}
      borderStyle="solid"
      borderColor={task.id === selectedTask?.task.id ? 'blue.600' : 'gray.200'}
      borderTopColor={getNodeColor(unwrap(task).label)}
      borderTopWidth={6}
      borderTopStyle="solid"
      overflow="hidden"
      boxShadow={task.id === selectedTask?.task.id ? undefined : 'base'}
      borderRadius="md"
    >
      <Flex px={2} py={1} fontSize="sm" fontWeight="medium" alignItems="center">
        <Heading as="h6" size="xs" textTransform="uppercase" isTruncated marginRight={2} title={task.name}>
          {task.name}
        </Heading>
        <HStack marginLeft="auto" spacing={1}>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              selectTask({ actionType: 'edit', task });
            }}
            aria-label="Edit workflow"
            icon={<EditIcon />}
            size="xs"
            colorScheme="blue"
          />
          <Box>
            <Menu isLazy>
              <MenuButton size="xs" as={IconButton} icon={<FeatherIcon icon="more-horizontal" size={12} />} />
              <Portal>
                <MenuList zIndex="dropdown" maxWidth={40}>
                  {task.type === 'SUB_WORKFLOW' && (
                    <>
                      <MenuItem
                        fontSize="sm"
                        onClick={() => {
                          selectTask({ actionType: 'expand', task });
                        }}
                      >
                        <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                          <Box
                            as={FeatherIcon}
                            size="1em"
                            icon="maximize"
                            flexShrink={0}
                            lineHeight={4}
                            verticalAlign="middle"
                          />
                        </Box>
                        Expand workflow
                      </MenuItem>
                      <Divider />
                    </>
                  )}
                  <MenuItem
                    color="red.500"
                    onClick={() => {
                      setRemovedTaskId(task.id);
                    }}
                    fontSize="sm"
                  >
                    <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                      <Box
                        as={FeatherIcon}
                        size="1em"
                        icon="trash-2"
                        flexShrink={0}
                        lineHeight={4}
                        verticalAlign="middle"
                      />
                    </Box>
                    Remove task
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </HStack>
      </Flex>
      <Flex background="gray.100">
        {inputs?.map((port) => {
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                width: theme.space[12],
                height: theme.space[6],
                fontSize: theme.fontSizes.xs,
                color: theme.colors.gray[700],
                marginRight: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
              },
            },
            'in',
          );
        })}
        {outputs?.map((port) => {
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                width: theme.space[12],
                height: theme.space[6],
                fontSize: theme.fontSizes.xs,
                color: theme.colors.gray[600],
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
              },
            },
            'out',
          );
        })}
      </Flex>
    </Box>
  );
};

export default TaskNode;
