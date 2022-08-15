import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tag,
  IconButton,
  Icon,
  Button,
  Link as ChakraLink,
  ButtonGroup,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

type IpRange = {
  id: string;
  name: string;
  network: string;
  broadcast: string;
  tags: { Tag: string; id: string }[];
  nestedRanges: {
    id: string;
    nestedPoolId: string | undefined;
  }[];
  size: bigint | number;
  freeCapacity: bigint | number;
  totalCapacity?: bigint | number;
};

type Props = {
  ipRanges: IpRange[];
  onTagClick: (tagName: string) => void;
  onDeleteBtnClick?: (poolId: string) => void;
};

const IpRangesTable: VoidFunctionComponent<Props> = ({ ipRanges, onTagClick, onDeleteBtnClick }) => {
  return (
    <TableContainer bgColor="white">
      <Table size="sm">
        <Thead bgColor="gray.200">
          <Tr>
            <Th>Network</Th>
            <Th>Broadcast</Th>
            <Th>Size</Th>
            <Th>Name</Th>
            <Th>Tags</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ipRanges.length > 0 ? (
            ipRanges.map(({ broadcast, network, size, tags, id, name, nestedRanges, freeCapacity }) => {
              return (
                <Tr key={id}>
                  {nestedRanges.length > 0 ? (
                    <Td>
                      <ChakraLink as={Link} textColor="blue" to={`../ipam/ip-ranges/${id}/nested-ranges`}>
                        {network}
                      </ChakraLink>
                    </Td>
                  ) : (
                    <Td>{network}</Td>
                  )}
                  <Td>{broadcast}</Td>
                  <Td>{new Intl.NumberFormat('fr').format(size)}</Td>
                  <Td>{name}</Td>
                  <Td>
                    {tags.map(({ Tag: tagName, id: tagId }) => (
                      <Tag key={tagId} mr={1} onClick={() => onTagClick(tagName)} cursor="pointer">
                        {tagName}
                      </Tag>
                    ))}
                  </Td>
                  <Td>
                    <ButtonGroup spacing={1}>
                      <IconButton
                        aria-label="config"
                        size="xs"
                        variant="outline"
                        icon={<Icon as={FeatherIcon} size={20} icon="settings" />}
                        as={Link}
                        to={`../pools/${id}`}
                      />
                      {onDeleteBtnClick && (
                        <IconButton
                          variant="outline"
                          size="xs"
                          colorScheme="red"
                          aria-label="delete"
                          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
                          disabled={freeCapacity !== 0}
                          onClick={() => {
                            onDeleteBtnClick(id);
                          }}
                        />
                      )}
                    </ButtonGroup>
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td>
                There are no ip ranges yet{' '}
                <Button variant="solid" colorScheme="blue" as={Link} to="/uniresource/pools/new" size="xs" ml={5}>
                  Create one
                </Button>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default IpRangesTable;
