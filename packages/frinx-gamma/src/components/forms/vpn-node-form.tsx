import React, { FC, FormEvent, useState } from 'react';
import { Button, Divider, Flex, Heading, Input, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import { uniqBy } from 'lodash';
import { VpnNode } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

type Props = {
  node: VpnNode;
  nodes: VpnNode[];
  onDelete: (carrierName: string) => void;
  onSubmit: (c: VpnNode) => void;
  onCancel: () => void;
};

const getNodeItems = (carriers: VpnNode[]): Item[] => {
  return uniqBy(
    carriers.map((n) => ({
      value: n.neId,
      label: n.neId,
    })),
    'value',
  );
};

const NodeForm: FC<Props> = ({ node, nodes, onDelete, onSubmit, onCancel }) => {
  const [vpnNode, setVpnNode] = useState(node);
  const [vpnNodes, setVpnNodes] = useState(nodes);
  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(vpnNode);
  };

  const handleNodeChange = (item?: Item | null) => {
    if (!item) {
      return;
    }

    const [filteredNode] = vpnNodes.filter((n) => n.neId === item.value);
    setVpnNode(filteredNode);
  };

  const handleCreateItem = (item: Item) => {
    // setVpnNodeItems([...vpnNodeItems, item]);
    setVpnNodes([
      ...vpnNodes,
      {
        neId: item.value,
        routerId: '',
        role: null,
      },
    ]);
    setVpnNode({
      neId: item.value,
      routerId: '',
      role: null,
    });
  };

  const handleDelete = () => {
    onDelete(vpnNode.neId);
  };

  const vpnNodeItems = getNodeItems(vpnNodes);
  const [selectedNode] = vpnNodeItems.filter((n) => {
    return n.value === vpnNode.neId;
  });

  return (
    <form onSubmit={handleEdit}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" marginBottom={2}>
          Save Node
        </Heading>
        <Button onClick={handleDelete} colorScheme="red">
          Delete
        </Button>
      </Flex>
      <FormControl id="vpn-node-id" my={6}>
        <FormLabel>Ne Id</FormLabel>
        <Autocomplete2
          items={vpnNodeItems}
          selectedItem={selectedNode}
          onChange={handleNodeChange}
          onCreateItem={handleCreateItem}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Router Id</FormLabel>
        <Input
          name="vpn-node-router-id"
          value={vpnNode.routerId}
          onChange={(event) => {
            setVpnNode({
              ...vpnNode,
              routerId: event.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Role</FormLabel>
        <Input
          name="vpn-node-role"
          value={vpnNode.role || ''}
          onChange={(event) => {
            setVpnNode({
              ...vpnNode,
              role: event.target.value || null,
            });
          }}
        />
      </FormControl>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue">
          Save changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default NodeForm;
