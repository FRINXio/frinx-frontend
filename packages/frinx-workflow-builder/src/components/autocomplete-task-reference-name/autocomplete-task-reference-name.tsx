import { InputGroup, InputLeftAddon, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ExtendedTask } from '../../helpers/types';

type Props = {
  tasks: ExtendedTask | ExtendedTask[];
  onChange: (updatedInputValue: string) => void;
  inputValue: string;
};

const AutocompleteTaskReferenceName: FC<Props> = ({ tasks, children, onChange, inputValue }) => {
  const tasksList: ExtendedTask[] = Array.isArray(tasks) ? tasks : [tasks];

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
    <InputGroup>
      <InputLeftAddon>
        <Menu>
          <MenuButton as={Text} cursor="pointer">
            Hints
          </MenuButton>
          <MenuList>
            {tasksList.map((task) => (
              <MenuItem key={task.id} onClick={() => autocompleteTaskRefName(task.taskReferenceName)}>
                {task.taskReferenceName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </InputLeftAddon>
      {children}
    </InputGroup>
  );
};

export default AutocompleteTaskReferenceName;
