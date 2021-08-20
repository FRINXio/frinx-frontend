import React, { VoidFunctionComponent } from 'react';
import {
  Icon,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Text,
  ButtonGroup,
  Box,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Snapshot } from '../../__generated__/graphql';

type Props = {
  onCreateSnapshotBtnClick: () => void;
  snapshots: Snapshot[];
  onLoadSnapshotClick: (name: string) => void;
  onCommitBtnClick: () => void;
  onDryRunBtnClick: () => void;
  onCalculateDiffBtnClick: () => void;
};

const DeviceConfigActions: VoidFunctionComponent<Props> = ({
  onCreateSnapshotBtnClick,
  snapshots,
  onLoadSnapshotClick,
  onCommitBtnClick,
  onDryRunBtnClick,
  onCalculateDiffBtnClick,
}) => {
  return (
    <Flex background="gray.300" paddingX={4} paddingY={2}>
      <ButtonGroup isAttached>
        <Button onClick={onCreateSnapshotBtnClick} leftIcon={<AddIcon />}>
          Create snapshot
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon size={20} as={FeatherIcon} icon="chevron-down" />}
            isDisabled={snapshots.length === 0}
          >
            Load snapshot
          </MenuButton>
          <MenuList>
            {snapshots.map((snapshot) => (
              <MenuItem
                key={snapshot.name}
                onClick={() => {
                  onLoadSnapshotClick(snapshot.name);
                }}
              >
                <Box>
                  <Heading as="h5" fontSize="sm" fontWeight={500} display="block">
                    {snapshot.name}
                  </Heading>
                  <Text as="span" fontSize="xs" color="gray.700">
                    {format(
                      utcToZonedTime(snapshot.createdAt, Intl.DateTimeFormat().resolvedOptions().timeZone),
                      'dd/mm/yyyy, k:m',
                    )}
                  </Text>
                </Box>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </ButtonGroup>
      <ButtonGroup isAttached marginLeft="auto">
        <Button onClick={onCalculateDiffBtnClick}>Calculate diff</Button>
        <Button onClick={onDryRunBtnClick} leftIcon={<Icon size={20} as={FeatherIcon} icon="play" />}>
          Dry run
        </Button>
        <Button
          onClick={onCommitBtnClick}
          colorScheme="blue"
          leftIcon={<Icon size={20} as={FeatherIcon} icon="server" />}
        >
          Commit to network
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default DeviceConfigActions;
