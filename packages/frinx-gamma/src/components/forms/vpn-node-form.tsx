import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Divider,
  Flex,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { uniqBy } from 'lodash';
import { VpnNode } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { getSelectOptions } from './options.helper';

const NodeSchema = yup.object().shape({
  neId: yup.string().required('Ne Id is required'),
  routerId: yup.string().required('Router Id is required'),
  role: yup.string().nullable(),
});

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
  const { values, errors, dirty, resetForm, setFieldValue, setValues, handleSubmit } = useFormik({
    initialValues: {
      ...node,
    },
    validationSchema: NodeSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });
  const [vpnNodes, setVpnNodes] = useState(nodes);

  const handleNodeChange = (item?: Item | null) => {
    if (!item) {
      return;
    }

    const [filteredNode] = vpnNodes.filter((n) => n.neId === item.value);
    setValues(filteredNode);
  };

  const handleCreateItem = (item: Item) => {
    setVpnNodes([
      ...vpnNodes,
      {
        neId: item.value,
        routerId: '',
        role: null,
      },
    ]);
    setValues({
      neId: item.value,
      routerId: '',
      role: null,
    });
  };

  const handleDelete = () => {
    onDelete(values.neId);
  };

  const vpnNodeItems = getNodeItems(vpnNodes);
  const [selectedNode] = vpnNodeItems.filter((n) => {
    return n.value === values.neId;
  });

  return (
    <form onSubmit={handleSubmit}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" marginBottom={2}>
          Save Node
        </Heading>
        <Button onClick={handleDelete} colorScheme="red">
          Delete
        </Button>
      </Flex>
      <FormControl id="vpn-node-id" my={6} isRequired isInvalid={errors.neId != null}>
        <FormLabel>VPN Node</FormLabel>
        <Autocomplete2
          items={vpnNodeItems}
          selectedItem={selectedNode}
          onChange={handleNodeChange}
          onCreateItem={handleCreateItem}
        />
        {errors.neId && <FormErrorMessage>{errors.neId}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6} isRequired isInvalid={errors.routerId != null}>
        <FormLabel>Router ID</FormLabel>
        <Input
          name="vpn-node-router-id"
          value={values.routerId}
          onChange={(event) => {
            setFieldValue('routerId', event.target.value);
          }}
        />
        {errors.routerId && <FormErrorMessage>{errors.routerId}</FormErrorMessage>}
      </FormControl>
      <FormControl my={6}>
        <FormLabel>Role</FormLabel>
        <Select
          name="vpn-node-role"
          value={values.role || ''}
          onChange={(event) => {
            setFieldValue('role', event.target.value || null);
          }}
          isDisabled
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer.roles).map((item) => {
            return (
              <option key={`roles-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty}>
          Save changes
        </Button>
        <Button onClick={() => resetForm()}>Clear</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default NodeForm;
