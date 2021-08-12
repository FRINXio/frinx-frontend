import React, { FC, useState } from 'react';
import { Text, ListItem, Box } from '@chakra-ui/react';
import { ExtendedTask } from '../../helpers/types';
import './autocomplete-task-reference-name.css';

type Props = {
  tasks: ExtendedTask | ExtendedTask[];
  onChange: (updatedInputValue: string) => void;
  inputValue: string;
};

const AutocompleteTaskReferenceName: FC<Props> = ({ tasks, children, onChange, inputValue }) => {
  const tasksList: ExtendedTask[] = Array.isArray(tasks) ? tasks : [tasks];
  const [isInputActive, setIsInputActive] = useState(false);

  const autocompleteTaskRefName = (taskRefName: string): void => {
    const inputValArr = inputValue.split('');
    const firstLetterOfRefName = inputValue.split('').findIndex((letter) => letter === '{') + 1;
    const lastLetterOfRefName = inputValue.split('').findIndex((letter) => letter === '.');

    const firtsPartOfInputValue = inputValArr.slice(0, firstLetterOfRefName);
    const lastPartOfInputValue = inputValArr.slice(lastLetterOfRefName);

    const result = [...firtsPartOfInputValue, ...taskRefName, ...lastPartOfInputValue];

    onChange(result.join(''));
  };

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
        <ul className="autocomplete-items">
          {tasksList.map((task) => (
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
        </ul>
      )}
    </Box>
  );
};

export default AutocompleteTaskReferenceName;
