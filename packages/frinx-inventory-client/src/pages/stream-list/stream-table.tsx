import {
  Checkbox,
  Flex,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { getLocalDateFromUTC } from '@frinx/shared';
import { Link } from 'react-router-dom';
import { StreamsQuery } from '../../__generated__/graphql';
import ActivateButton from './activate-button';

type SortedBy = 'streamName' | 'deviceName' | 'createdAt';
type Direction = 'ASC' | 'DESC';
type OrderBy = {
  sortKey: SortedBy;
  direction: Direction;
} | null;

type Props = {
  orderBy: OrderBy;
  streams: StreamsQuery['deviceInventory']['streams']['edges'];
  selectedStreams: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  onSort: (sortedBy: SortedBy) => void;
  onInstallButtonClick: (streamId: string) => void;
  onUninstallButtonClick: (streamId: string) => void;
  onDeleteBtnClick: (streamId: string) => void;
  onStreamSelection: (streamId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
};

const StreamTable: VoidFunctionComponent<Props> = ({
  orderBy,
  streams,
  selectedStreams,
  onSort,
  onInstallButtonClick,
  onUninstallButtonClick,
  onDeleteBtnClick, // eslint-disable-line @typescript-eslint/no-unused-vars
  installLoadingMap,
  onStreamSelection,
  areSelectedAll,
  onSelectAll,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>
            <Checkbox isChecked={areSelectedAll} onChange={(e) => onSelectAll(e.target.checked)} mr={2} />
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('streamName')}
            >
              <Text>Stream Name</Text>
              {orderBy?.sortKey === 'streamName' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('deviceName')}
            >
              <Text>Device Name</Text>
              {orderBy?.sortKey === 'deviceName' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('createdAt')}
            >
              <Text>Activated</Text>
              {orderBy?.sortKey === 'createdAt' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          <Th>Stream Duration</Th>
          <Th>Activation</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {streams.map(({ node: stream }) => {
          const { isActive } = stream;
          const localDate = getLocalDateFromUTC(stream.createdAt);
          const streamDuration = stream.startedAt
            ? intervalToDuration({
                start: new Date(stream.startedAt),
                end: stream.stoppedAt ? new Date(stream.stoppedAt) : Date.now(),
              })
            : null;

          const isLoading = installLoadingMap[stream.id] ?? false;

          return (
            <Tr key={stream.id}>
              <Td>
                <Checkbox
                  data-cy={`stream-check-box-${stream.streamName}`}
                  isChecked={selectedStreams.has(stream.id)}
                  onChange={(e) => onStreamSelection(stream.id, e.target.checked)}
                />
              </Td>
              <Td>
                <Text data-cy={`stream-name-${stream.streamName}`} as="span" fontWeight={600}>
                  {stream.streamName}
                </Text>
              </Td>
              <Td>
                <Text data-cy={`stream-name-${stream.deviceName}`} as="span" fontWeight={600}>
                  {stream.deviceName}
                </Text>
              </Td>
              <Td>
                <Tooltip label={format(localDate, 'dd/MM/yyyy, k:mm')}>
                  <Text
                    data-cy={`device-created-at-${stream.streamName}`}
                    as="span"
                    fontSize="sm"
                    color="blackAlpha.700"
                  >
                    {formatDistanceToNow(localDate)} ago
                  </Text>
                </Tooltip>
              </Td>

              <Td>
                <Text data-cy={`device-started-at-${stream.streamName}`} as="span" fontSize="sm" color="blackAlpha.700">
                  {streamDuration
                    ? formatDuration(streamDuration, {
                        format: ['hours', 'minutes'],
                        zero: true,
                      })
                    : '-'}
                </Text>
              </Td>
              <Td minWidth={200}>
                <ActivateButton
                  streamName={stream.streamName}
                  isInstalled={isActive}
                  isLoading={isLoading}
                  onActivateClick={() => {
                    onInstallButtonClick(stream.id);
                  }}
                  onDeactivateClick={() => {
                    onUninstallButtonClick(stream.id);
                  }}
                />
              </Td>
              <Td minWidth={200}>
                <HStack spacing={2}>
                  {/* <IconButton
                    data-cy={`device-settings-${stream.streamName}`}
                    aria-label="config"
                    size="sm"
                    isDisabled={!isInstalled}
                    disabled={!isInstalled}
                    icon={<Icon size={12} as={FeatherIcon} icon="settings" />}
                    as={isInstalled ? Link : 'button'}
                    {...(isInstalled ? { to: `../config/${stream.id}` } : {})}
                  /> */}
                  <IconButton
                    data-cy={`device-edit-${stream.streamName}`}
                    aria-label="edit"
                    size="sm"
                    isDisabled={isActive}
                    disabled={isActive}
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    as={isActive ? 'button' : Link}
                    {...(isActive ? {} : { to: `${stream.id}/edit` })}
                  />
                  <IconButton
                    data-cy={`device-delete-${stream.streamName}`}
                    aria-label="Delete device"
                    size="sm"
                    isDisabled={isActive}
                    disabled={isActive}
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteBtnClick(stream.id);
                    }}
                  />
                </HStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default StreamTable;
