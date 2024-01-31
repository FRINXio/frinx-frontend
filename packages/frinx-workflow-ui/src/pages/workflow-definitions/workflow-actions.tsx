import React, { FC } from 'react';
import {
  Box,
  Icon,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { ClientWorkflow } from '@frinx/shared';

type Props = {
  workflow: ClientWorkflow;
  onDeleteBtnClick: () => void;
  onDiagramBtnClick: () => void;
  onDefinitionBtnClick: () => void;
  onScheduleBtnClick: () => void;
  onExecuteBtnClick: () => void;
};

const WorkflowActions: FC<Props> = ({
  workflow,
  onDeleteBtnClick,
  onDiagramBtnClick,
  onDefinitionBtnClick,
  onScheduleBtnClick,
  onExecuteBtnClick,
}) => {
  return (
    <Stack direction="row" spacing={4}>
      <ButtonGroup size="sm" variant="solid">
        <IconButton
          data-cy={`exec-${workflow.name}-${workflow.version}`}
          aria-label="execute-workflow"
          title="Execute workflow"
          colorScheme="blue"
          icon={<Icon size={12} as={FeatherIcon} icon="play" />}
          onClick={onExecuteBtnClick}
        />

        <IconButton
          data-cy={`exec-${workflow.name}-${workflow.version}`}
          aria-label="schedule-workflow"
          title={workflow.hasSchedule ? 'Edit schedule' : 'Create schedule'}
          colorScheme="blue"
          variant="outline"
          icon={<Icon size={12} as={FeatherIcon} icon="clock" />}
          onClick={onScheduleBtnClick}
        />

        <IconButton
          data-cy={`edit-${workflow.name}-${workflow.version}`}
          aria-label="edit-workflow"
          icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
          as={Link}
          to={`../builder/${workflow.id}/${workflow.version}`}
        />

        <IconButton
          data-cy={`del-${workflow.name}-${workflow.version}`}
          aria-label="delete-workflow"
          colorScheme="red"
          icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
          onClick={onDeleteBtnClick}
        />

        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            color="white"
            background="black"
            data-cy={`menu-${workflow.name}-${workflow.version}`}
          >
            <Box as="span" flexShrink={0} alignSelf="center">
              <Box as={FeatherIcon} size="1em" icon="menu" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onDiagramBtnClick} data-cy={`diag-${workflow.name}-${workflow.version}`}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box
                  as={FeatherIcon}
                  size="1em"
                  icon="git-branch"
                  flexShrink={0}
                  lineHeight={4}
                  verticalAlign="middle"
                />
              </Box>
              Show diagram
            </MenuItem>
            <MenuItem onClick={onDefinitionBtnClick} data-cy={`showdef-${workflow.name}-${workflow.version}`}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="code" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Show definition
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Stack>
  );
};

export default WorkflowActions;
