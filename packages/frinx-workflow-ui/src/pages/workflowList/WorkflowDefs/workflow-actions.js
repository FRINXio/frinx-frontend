// @flow
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCodeBranch,
  faEdit,
  faFileCode,
  faListUl,
  faPlay,
  faSearch,
  faStar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons';
import FeatherIcon from 'feather-icons-react';
import { jsonParse } from '../../../common/utils';

type Workflow = {
  name: string,
  version: number,
  description: string,
  hasSchedule: boolean,
};
type Props = {
  isFavourite: boolean,
  hasSchedule: boolean,
  onDeleteBtnClick: () => void,
  onFavouriteBtnClick: () => void,
  onDiagramBtnClick: () => void,
  onDefinitionBtnClick: () => void,
  onListBtnClick: () => void,
  onEditBtnClick: () => void,
  onScheduleBtnClick: () => void,
  onExecuteBtnClick: () => void,
};

const WorkflowActions = ({
  isFavourite,
  hasSchedule,
  onDeleteBtnClick,
  onFavouriteBtnClick,
  onDiagramBtnClick,
  onDefinitionBtnClick,
  onListBtnClick,
  onEditBtnClick,
  onScheduleBtnClick,
  onExecuteBtnClick,
}: Props) => {
  return (
    <Stack direction="row" spacing={4}>
      <ButtonGroup>
        <Button
          colorScheme="red"
          size="sm"
          variant="outline"
          onClick={onDeleteBtnClick}
          // leftIcon={<Icon as={FontAwesomeIcon} icon={faTrash} />}
        >
          <Box as="span" flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="trash-2" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
        </Button>
        <Button
          colorScheme="black"
          size="sm"
          variant="outline"
          // leftIcon={<Icon as={FontAwesomeIcon} icon={faEdit} />}
          onClick={onEditBtnClick}
        >
          <Box as="span" flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="edit" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          variant="outline"
          // leftIcon={<Icon as={FontAwesomeIcon} icon={faPlay} />}
          onClick={onExecuteBtnClick}
        >
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
            <MenuItem onClick={onListBtnClick}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="list" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Show workflow list
            </MenuItem>
            <MenuItem onClick={onScheduleBtnClick}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="clock" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              {hasSchedule ? 'Edit schedule' : 'Create schedule'}
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Stack>
  );
};

export default WorkflowActions;
