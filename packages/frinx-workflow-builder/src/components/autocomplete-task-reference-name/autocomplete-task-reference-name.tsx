import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, ListItem, Box, List } from '@chakra-ui/react';
import { ExtendedTask } from '../../helpers/types';
import './autocomplete-task-reference-name.css';

type Props = {
  tasks: ExtendedTask | ExtendedTask[];
  onChange: (updatedInputValue: string) => void;
  inputValue: string;
};

const AutocompleteTaskReferenceName: FC<Props> = ({ tasks, children, onChange, inputValue }) => {
  const tasksList: ExtendedTask[] = useMemo(() => {
    return Array.isArray(tasks) ? tasks : [tasks];
  }, [tasks]) as ExtendedTask[];
  const [filteredTasks, setFilteredTasks] = useState(tasksList);
  const [isInputActive, setIsInputActive] = useState(false);

  const autocompleteTaskRefName = (taskRefName: string): void => {
    onChange('${'.concat(taskRefName));
  };

  useEffect(() => {
    setFilteredTasks(() => {
      return tasksList.filter((task) => {
        const inputVal = inputValue.replace('${', '');
        return task.taskReferenceName.toLowerCase().includes(inputVal.toLowerCase());
      });
    });
  }, [inputValue, tasksList]);

  return (
    <Box
      className="autocomplete"
      onClick={() => setIsInputActive(true)}
      onBlur={() => {
        setTimeout(() => setIsInputActive(false), 150);
      }}
    >
      {children}
      {isInputActive && (
        <List className="autocomplete-items">
          {filteredTasks.map((task) => (
            <ListItem
              key={task.id}
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

export default AutocompleteTaskReferenceName;
