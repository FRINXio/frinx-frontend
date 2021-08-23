import {
  Grid,
  GridItem,
  Heading,
  Box,
  ButtonGroup,
  Button,
  Flex,
  Icon,
  MenuButton,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import AceEditor from 'react-ace';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { ChevronDownIcon } from '@chakra-ui/icons';

type Props = {
  config: string;
  operational: string;
  onConfigChange: (config: string) => void;
  onConfigSaveBtnClick: () => void;
  onReplaceBtnClick: () => void;
  onRefreshBtnClick: () => void;
  onSyncBtnClick: () => void;
};

const DeviceConfigEditors: VoidFunctionComponent<Props> = ({
  config,
  operational,
  onConfigChange,
  onConfigSaveBtnClick,
  onRefreshBtnClick,
  onReplaceBtnClick,
  onSyncBtnClick,
}) => {
  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem w="100%">
          <Box>
            <Heading as="h3" size="md">
              Config data store
            </Heading>
          </Box>
          <Flex justifyContent="flex-end" paddingX={4} paddingY={2}>
            <ButtonGroup size="sm" isAttached>
              <Button
                colorScheme="blue"
                leftIcon={<Icon size={20} as={FeatherIcon} icon="save" />}
                onClick={onConfigSaveBtnClick}
              >
                Save
              </Button>
              <Button leftIcon={<Icon size={20} as={FeatherIcon} icon="refresh-cw" />} onClick={onRefreshBtnClick}>
                Refresh
              </Button>
              <Menu>
                <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
                <Portal>
                  <MenuList zIndex="tooltip">
                    <MenuItem onClick={onReplaceBtnClick}>Replace with operational</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </ButtonGroup>
          </Flex>
          <AceEditor
            width="100%"
            mode="json"
            value={config}
            theme="tomorrow"
            onChange={(val) => {
              onConfigChange(val);
            }}
          />
        </GridItem>
        <GridItem w="100%">
          <Box>
            <Heading as="h3" size="md">
              Operational data store
            </Heading>
          </Box>
          <Flex justifyContent="flex-end" paddingX={4} paddingY={2}>
            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<Icon size={20} as={FeatherIcon} icon="refresh-ccw" />}
              onClick={onSyncBtnClick}
            >
              Sync from network
            </Button>
          </Flex>
          <AceEditor width="100%" mode="json" value={operational} theme="tomorrow" readOnly />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DeviceConfigEditors;
