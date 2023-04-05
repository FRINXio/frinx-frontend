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
import { jsonParse } from '@frinx/shared/src';
import { Workflow } from './workflow-types';

type Props = {
  workflow: Workflow;
  onDeleteBtnClick: () => void;
  onFavouriteBtnClick: () => void;
  onDiagramBtnClick: () => void;
  onDefinitionBtnClick: () => void;
  onScheduleBtnClick: () => void;
  onExecuteBtnClick: () => void;
};

const WorkflowActions: FC<Props> = ({
  workflow,
  onDeleteBtnClick,
  onFavouriteBtnClick,
  onDiagramBtnClick,
  onDefinitionBtnClick,
  onScheduleBtnClick,
  onExecuteBtnClick,
}) => {
  const isFavourite = jsonParse<{ labels: string[] }>(workflow.description)?.labels?.includes('FAVOURITE') ?? false;

  return (
    <Stack direction="row" spacing={4}>
      <ButtonGroup>
        <IconButton
          data-cy={`del-${workflow.name}-${workflow.version}`}
          aria-label="delete-workflow"
          size="sm"
          colorScheme="red"
          icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
          onClick={onDeleteBtnClick}
        />
        <IconButton
          data-cy={`edit-${workflow.name}-${workflow.version}`}
          aria-label="edit-workflow"
          size="sm"
          icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
          as={Link}
          to={`../builder/${workflow.name}/${workflow.version}`}
        />
        <IconButton
          data-cy={`exec-${workflow.name}-${workflow.version}`}
          aria-label="execute-workflow"
          size="sm"
          colorScheme="blue"
          icon={<Icon size={12} as={FeatherIcon} icon="play" />}
          onClick={onExecuteBtnClick}
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
            <MenuItem onClick={onFavouriteBtnClick} data-cy={`favor-${workflow.name}-${workflow.version}`}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="star" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              {isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            </MenuItem>
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
            <MenuItem onClick={onScheduleBtnClick} data-cy={`sched-${workflow.name}-${workflow.version}`}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="clock" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              {workflow.hasSchedule ? 'Edit schedule' : 'Create schedule'}
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Stack>
  );
};

export default WorkflowActions;
