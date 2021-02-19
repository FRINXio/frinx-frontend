import React, { FC } from 'react';
import { Box, Button, Divider, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';

type Props = {
  onShowDefinitionBtnClick: () => void;
  onNewWorkflowBtnClick: () => void;
  onEditWorkflowBtnClick: () => void;
};

const ActionsMenu: FC<Props> = ({ onShowDefinitionBtnClick, onNewWorkflowBtnClick, onEditWorkflowBtnClick }) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
            <Box as={FeatherIcon} size="1em" icon="save" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
          Save workflow
        </MenuItem>
        <MenuItem onClick={onShowDefinitionBtnClick}>
          <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
            <Box as={FeatherIcon} size="1em" icon="code" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
          Show definition
        </MenuItem>
        <Divider my={2} />
        <MenuGroup title="Create">
          <MenuItem onClick={onNewWorkflowBtnClick}>
            <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
              <Box as={FeatherIcon} size="1em" icon="plus" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
            New workflow
          </MenuItem>
          <MenuItem>
            <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
              <Box as={FeatherIcon} size="1em" icon="file-plus" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
            Import workflow
          </MenuItem>
          <MenuItem>
            <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
              <Box as={FeatherIcon} size="1em" icon="download" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
            Export workflow
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="Edit">
          <MenuItem onClick={onEditWorkflowBtnClick}>
            <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
              <Box as={FeatherIcon} size="1em" icon="edit" flexShrink={0} lineHeight={4} verticalAlign="middle" />
            </Box>
            Edit workflow
          </MenuItem>
        </MenuGroup>
        <Divider my={2} />
        <MenuItem color="red.500">
          <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
            <Box as={FeatherIcon} size="1em" icon="trash" flexShrink={0} lineHeight={4} verticalAlign="middle" />
          </Box>
          Delete workflow
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ActionsMenu;
