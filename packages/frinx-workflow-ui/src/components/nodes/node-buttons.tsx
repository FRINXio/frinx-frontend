import { Box, Divider, HStack, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { FC, memo } from 'react';

type Props = {
  onEditButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onExpandButtonClick?: () => void;
};

const NodeButtons: FC<Props> = memo(({ onEditButtonClick, onDeleteButtonClick, onExpandButtonClick }) => {
  return (
    <HStack marginLeft="auto" spacing={1}>
      <IconButton
        onClick={onEditButtonClick}
        aria-label="Edit workflow"
        icon={<Icon as={FeatherIcon} icon="edit" size={12} />}
        size="xs"
        colorScheme="blue"
      />
      <Box>
        <Menu isLazy>
          <MenuButton size="xs" as={IconButton} icon={<Icon as={FeatherIcon} icon="more-horizontal" size={12} />} />
          <Portal>
            <MenuList zIndex="dropdown" maxWidth={40}>
              {onExpandButtonClick && (
                <>
                  <MenuItem fontSize="sm" onClick={onExpandButtonClick}>
                    <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                      <Box
                        as={FeatherIcon}
                        size="1em"
                        icon="maximize"
                        flexShrink={0}
                        lineHeight={4}
                        verticalAlign="middle"
                      />
                    </Box>
                    Expand workflow
                  </MenuItem>
                  <Divider />
                </>
              )}
              <MenuItem color="red.500" onClick={onDeleteButtonClick} fontSize="sm">
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box
                    as={FeatherIcon}
                    size="1em"
                    icon="trash-2"
                    flexShrink={0}
                    lineHeight={4}
                    verticalAlign="middle"
                  />
                </Box>
                Remove task
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </HStack>
  );
});

export default NodeButtons;
