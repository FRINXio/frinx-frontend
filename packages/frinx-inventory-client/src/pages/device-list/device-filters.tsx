import { Box, Flex, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { VoidFunctionComponent } from 'react';
import { DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import SearchByLabelInput from '../../components/search-by-label-input';
import { LabelsQuery } from '../../__generated__/graphql';

type Props = {
  labels: LabelsQuery['labels']['edges'];
  selectedLabels: Item[];
  isCreationDisabled?: boolean;
  onSelectionChange: (labels?: Item[]) => void;
  onLabelCreate?: (label: Item) => void;
  handleOnDeleteClick: () => void;
};
const DeviceFilter: VoidFunctionComponent<Props> = ({
  labels,
  selectedLabels,
  onSelectionChange,
  handleOnDeleteClick,
}) => {
  return (
    <Box>
      <Flex>
        <SearchByLabelInput
          items={labels}
          selectedLabels={selectedLabels}
          onSelectionChange={onSelectionChange}
          isCreationDisabled
          labelText="Filter by labels"
        />
        <Spacer />
        <Box>
          <Menu isLazy>
            <MenuButton as={IconButton} icon={<Icon size={12} as={SettingsIcon} />} backgroundColor="white" />
            <MenuList>
              <MenuItem onClick={handleOnDeleteClick}>
                <Box as="span" fontSize="sm" paddingRight={3} flexShrink={0}>
                  <Box
                    as={DeleteIcon}
                    size="1em"
                    icon="file-plus"
                    flexShrink={0}
                    lineHeight={4}
                    verticalAlign="middle"
                  />
                </Box>
                Delete selected devices
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default DeviceFilter;
