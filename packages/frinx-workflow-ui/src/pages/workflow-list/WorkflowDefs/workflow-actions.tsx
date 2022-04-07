import React, { FC } from 'react';
import { Box, Button, ButtonGroup, Menu, MenuButton, MenuItem, MenuList, Stack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { Workflow } from '../../../helpers/types';
import { jsonParse } from '../../../common/utils';

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
  const isFavourite = jsonParse(workflow.description)?.labels?.includes('FAVOURITE') ?? false;

  return (
    <Stack direction="row" spacing={4}>
      <ButtonGroup>
        <Button colorScheme="red" size="sm" variant="outline" onClick={onDeleteBtnClick}>
          <Box as="span" flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="trash-2" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
        </Button>
        <Button
          colorScheme="black"
          size="sm"
          variant="outline"
          as={Link}
          to={`/uniflow/builder/${workflow.name}/${workflow.version}`}
        >
          <Box as="span" flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="edit" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
        </Button>
        <Button colorScheme="blue" size="sm" variant="outline" onClick={onExecuteBtnClick}>
          <Box as="span" flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="play" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
        </Button>
        <Menu>
          <MenuButton as={Button} variant="outline" size="sm" colorScheme="black">
            <Box as="span" flexShrink={0} alignSelf="center">
              <Box as={FeatherIcon} size="1em" icon="menu" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onFavouriteBtnClick}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="star" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              {isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            </MenuItem>
            <MenuItem onClick={onDiagramBtnClick}>
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
            <MenuItem onClick={onDefinitionBtnClick}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="code" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Show definition
            </MenuItem>
            <MenuItem onClick={onScheduleBtnClick}>
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
