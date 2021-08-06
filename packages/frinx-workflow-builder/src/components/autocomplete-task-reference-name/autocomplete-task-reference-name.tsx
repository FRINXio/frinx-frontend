import { InputGroup, InputLeftAddon, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ExtendedTask } from '../../helpers/types';

type Props = {
  tasks: ExtendedTask | ExtendedTask[];
  onChange: (updatedInputValue: string) => void;
  propChildren: string;
};

const AutocompleteTaskReferenceName: FC<Props> = ({ tasks, children, onChange, propChildren }) => {
  const tasksList: ExtendedTask[] = Array.isArray(tasks) ? tasks : [tasks];

  const autocompleteTaskRefName = (taskRefName: string): void => {
    onChange('${'.concat(`${taskRefName}.${propChildren}`));
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
