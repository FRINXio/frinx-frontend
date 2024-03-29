import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Snapshot } from '../../__generated__/graphql';

type Props = {
  config: string;
  operational: string;
  onConfigChange: (config: string) => void;
  onConfigSaveBtnClick: () => void;
  onReplaceBtnClick: () => void;
  onRefreshBtnClick: () => void;
  onSyncBtnClick: () => void;
  isUpdateStoreLoading: boolean;
  isResetLoading: boolean;
  isSyncLoading: boolean;
  isRefreshLoading: boolean;
  isApplySnapshotLoading: boolean;
  onLoadSnapshotClick: (name: string) => void;
  snapshots: Snapshot[];
  onCreateSnapshotBtnClick: () => void;
  onDeleteSnapshotBtnClck: (name: string) => void;
};

const DeviceConfigEditors: VoidFunctionComponent<Props> = ({
  config,
  operational,
  onConfigChange,
  onConfigSaveBtnClick,
  onRefreshBtnClick,
  onReplaceBtnClick,
  onSyncBtnClick,
  isResetLoading,
  isUpdateStoreLoading,
  isSyncLoading,
  isRefreshLoading,
  isApplySnapshotLoading,
  onCreateSnapshotBtnClick,
  onLoadSnapshotClick,
  snapshots,
  onDeleteSnapshotBtnClck,
}) => {
  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem w="100%">
          <Box marginBottom={4}>
            <Heading as="h3" size="md">
              Config data store
            </Heading>
          </Box>
          <Flex justifyContent="flex-end" marginBottom={4} paddingY={2}>
            <ButtonGroup size="sm" isAttached>
              <Button
                data-cy="device-config-refresh"
                leftIcon={<Icon size={20} as={FeatherIcon} icon="refresh-cw" />}
                onClick={onRefreshBtnClick}
                isLoading={isRefreshLoading}
              >
                Refresh
              </Button>
              <Menu>
                <MenuButton as={IconButton} icon={<Icon size={30} as={FeatherIcon} icon="chevron-down" />} />
                <Portal>
                  <MenuList zIndex="tooltip">
                    <MenuItem isDisabled={isResetLoading} onClick={onReplaceBtnClick}>
                      Replace with operational
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
              <Button
                data-cy="device-config-save"
                colorScheme="blue"
                isLoading={isUpdateStoreLoading}
                leftIcon={<Icon size={20} as={FeatherIcon} icon="save" />}
                onClick={onConfigSaveBtnClick}
              >
                Save
              </Button>
            </ButtonGroup>
          </Flex>
          <Editor
            width="100%"
            language="json"
            value={config}
            onChange={(val) => {
              onConfigChange(val ?? '');
            }}
          />
        </GridItem>
        <GridItem w="100%">
          <Box marginBottom={4}>
            <Heading as="h3" size="md">
              Operational data store
            </Heading>
          </Box>
          <Flex justifyContent="flex-end" marginBottom={4} paddingY={2}>
            <ButtonGroup isAttached size="sm" marginRight="auto">
              <Button
                data-cy="device-config-create-snapshot"
                onClick={onCreateSnapshotBtnClick}
                leftIcon={<Icon size={30} as={FeatherIcon} icon="plus" />}
              >
                Create snapshot
              </Button>
              <Menu>
                <MenuButton
                  data-cy="device-config-load-snapshot"
                  as={Button}
                  rightIcon={<Icon size={20} as={FeatherIcon} icon="chevron-down" />}
                  isDisabled={snapshots.length === 0}
                >
                  Load snapshot
                </MenuButton>
                <MenuList>
                  {snapshots.map((snapshot) => (
                    <MenuItem
                      data-cy={`device-config-snapshot-${snapshot.name}`}
                      key={snapshot.name}
                      position="relative"
                      as="div"
                    >
                      <Box
                        as="button"
                        textAlign="left"
                        _hover={{
                          textDecoration: 'underline',
                        }}
                        disabled={isApplySnapshotLoading}
                        onClick={() => {
                          onLoadSnapshotClick(snapshot.name);
                        }}
                      >
                        <Heading as="h5" fontSize="sm" fontWeight={500} display="block">
                          {snapshot.name}
                        </Heading>
                        <Text as="span" fontSize="xs" color="gray.700">
                          {format(
                            utcToZonedTime(snapshot.createdAt, Intl.DateTimeFormat().resolvedOptions().timeZone),
                            'dd/MM/yyyy, k:m',
                          )}
                        </Text>
                      </Box>
                      <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                        <IconButton
                          data-cy={`device-config-delete-snapshot-${snapshot.name}`}
                          aria-label="Delete snapshot"
                          icon={<Icon size={18} as={FeatherIcon} icon="trash-2" />}
                          colorScheme="red"
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            onDeleteSnapshotBtnClck(snapshot.name);
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </ButtonGroup>
            <Button
              data-cy="device-config-sync"
              size="sm"
              colorScheme="blue"
              isLoading={isSyncLoading}
              leftIcon={<Icon size={20} as={FeatherIcon} icon="refresh-ccw" />}
              onClick={onSyncBtnClick}
            >
              Sync from network
            </Button>
          </Flex>
          <Editor width="100%" language="json" defaultValue={operational} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DeviceConfigEditors;
