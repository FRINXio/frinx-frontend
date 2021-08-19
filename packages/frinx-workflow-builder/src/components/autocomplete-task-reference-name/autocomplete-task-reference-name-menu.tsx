import React, { FC, useState } from 'react';
import { Text, ListItem, Box, List } from '@chakra-ui/react';
import { ExtendedTask } from '../../helpers/types';

type Props = {
  tasks: ExtendedTask[];
  onChange: (updatedInputValue: string) => void;
  inputValue: string;
};

const AutocompleteTaskReferenceNameMenu: FC<Props> = ({ tasks, children, onChange, inputValue }) => {
  const tasksList: ExtendedTask[] = tasks;
  const [isInputActive, setIsInputActive] = useState(false);

  const autocompleteTaskRefName = (taskRefName: string): void => {
    onChange('${'.concat(taskRefName));
  };

  const filteredTasks = tasksList.filter((task) => {
    const inputVal = inputValue.replace('${', '');
    return task.taskReferenceName.toLowerCase().includes(inputVal.toLowerCase()) && task.taskReferenceName !== inputVal;
  });

  return (
    <Box
      position="relative"
      display="inline-block"
      onClick={() => setIsInputActive(true)}
      onBlur={() => {
        setTimeout(() => setIsInputActive(false), 150);
      }}
    >
      {children}
      {isInputActive && (
        <List
          borderX="1px solid #e9e9e9"
          position="absolute"
          borderTop="none"
          zIndex="99"
          top="100%"
          left={0}
          right={0}
          listStyleType="none"
          borderBottom="1px solid #e9e9e9"
        >
          {filteredTasks.map((task, i) => (
            <ListItem
              padding={4}
              cursor="pointer"
              backgroundColor="#fff"
              _hover={{ backgroundColor: '#e9e9e9' }}
              key={task.id}
              borderBottomRadius={i === filteredTasks.length - 1 ? 0 : 2}
              borderBottom={i === filteredTasks.length - 1 ? '' : '1px solid #e9e9e9'}
              onClick={() => {
                autocompleteTaskRefName(task.taskReferenceName);
              }}
              onBlur={() => setIsInputActive(false)}
            >
              <Text>{task.taskReferenceName}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AutocompleteTaskReferenceNameMenu;
