import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  Flex,
  HStack,
  Tag,
  Box,
  Divider,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  Input,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { uniqBy } from 'lodash';
import { VpnServiceTopology, DefaultCVlanEnum, VpnService } from './service-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

type Props = {
  mode: 'add' | 'edit';
  services: VpnService[];
  service: VpnService;
  extranetVpns: string[];
  onSubmit: (s: VpnService) => void;
  onCancel: () => void;
};

const getCustomerItems = (services: VpnService[]): Item[] => {
  return uniqBy(
    services.map((s) => ({
      value: s.customerName,
      label: s.customerName,
    })),
    'value',
  );
};

const VpnServiceForm: FC<Props> = ({ mode, extranetVpns, service, services, onSubmit, onCancel }) => {
  const [serviceState, setServiceState] = useState(service);
  const [extranetVpnSelect, setExtranetVpnSelect] = useState<string | null>(null);
  const [customerItems, setCustomerItems] = useState<Item[]>(getCustomerItems(services));

  useEffect(() => {
    setServiceState({
      ...service,
    });
  }, [service]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(serviceState);
  };

  const handleCustomerChange = (customerName?: Item | null) => {
    if (!customerName) {
      return;
    }
    const [newService] =
      mode === 'edit'
        ? services.filter((s) => s.customerName === customerName.value)
        : [
            {
              ...serviceState,
              customerName: customerName.value,
            },
          ];
    setServiceState(newService);
  };

  const handleExtranetVpnAdd = () => {
    if (!extranetVpnSelect) {
      return;
    }
    const newExtranetVpns = [...serviceState.extranetVpns, extranetVpnSelect];
    setServiceState({
      ...serviceState,
      extranetVpns: newExtranetVpns,
    });
    setExtranetVpnSelect(null);
  };

  const handleExtranetVpnRemove = (vpn: string) => {
    const newExtranetVpns = [...serviceState.extranetVpns].filter((v) => v !== vpn);
    setServiceState({
      ...serviceState,
      extranetVpns: newExtranetVpns,
    });
  };

  const handleDeselectCustomerName = () => {
    setServiceState({
      ...serviceState,
      customerName: '',
    });
  };

  const handleCreateItem = (item: Item) => {
    setCustomerItems([...customerItems, item]);
    setServiceState({
      ...serviceState,
      customerName: item.value,
    });
  };

  const filteredExtranetVpns = extranetVpns.filter((ev) => {
    return !serviceState.extranetVpns.includes(ev);
  });

  const [selectedCustomerItem] = customerItems.filter((ci) => ci.value === serviceState.customerName);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="customerName" my={6}>
        <FormLabel>Customer Name</FormLabel>
        <Flex>
          <Box flex="1">
            <Autocomplete2
              items={customerItems}
              selectedItem={selectedCustomerItem}
              onChange={handleCustomerChange}
              onCreateItem={handleCreateItem}
            />
          </Box>
          <Box marginLeft={4} alignSelf="center">
            <IconButton
              size="sm"
              aria-label="Deselect Customer Name"
              icon={<CloseIcon />}
              onClick={handleDeselectCustomerName}
            />
          </Box>
        </Flex>
      </FormControl>
      <FormControl id="vpnServiceTopology" my={6}>
        <FormLabel>Vpn Service Topology</FormLabel>
        <Select
          variant="filled"
          name="vpnServiceTopology"
          value={serviceState.vpnServiceTopology}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as VpnServiceTopology;
            setServiceState({
              ...serviceState,
              vpnServiceTopology: eventValue,
            });
          }}
        >
          <option value="any-to-any">any-to-any</option>
          <option value="hub-spoke">hub-spoke</option>
          <option value="hub-spoke-disjointed">hub-spoke-disjointed</option>
        </Select>
      </FormControl>
      <FormControl id="defaultCVlan" my={6}>
        <FormLabel>Default C Vlan</FormLabel>
        <Select
          variant="filled"
          name="defaultCVlan"
          value={serviceState.defaultCVlan}
          onChange={(event) => {
            event.persist();
            const defaultCVlan = event.target.value as unknown as DefaultCVlanEnum;
            setServiceState({
              ...serviceState,
              defaultCVlan,
            });
          }}
        >
          {[...Object.entries(DefaultCVlanEnum)].map((e) => {
            const [k, v] = e;
            return (
              <option key={k} value={v}>
                {k}
              </option>
            );
          })}
        </Select>
      </FormControl>

      {serviceState.defaultCVlan === 'custom' && (
        <FormControl id="custom-c-vlan" my={6}>
          <FormLabel>Custom C-VLAN</FormLabel>
          <Input
            variant="filled"
            name="custom-c-vlan"
            value={serviceState.customCVlan || ''}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isNaN(value)) {
                return;
              }
              setServiceState({
                ...serviceState,
                customCVlan: value,
              });
            }}
          />
        </FormControl>
      )}
      <FormControl id="extranet-vpns" my={6}>
        <FormLabel>Extranet VPNs</FormLabel>
        <Flex
          alignItems="stretch"
          border="1px"
          borderColor="gray.200"
          px={4}
          my={4}
          borderRadius="md"
          userSelect="none"
        >
          <Box py={4} flex={1}>
            <Select
              variant="filled"
              name="extranetVpns"
              value={extranetVpnSelect || ''}
              onChange={(event) => {
                event.persist();
                const eventValue = event.target.value as string;
                setExtranetVpnSelect(eventValue);
              }}
            >
              <option>-- choose option</option>
              {filteredExtranetVpns &&
                filteredExtranetVpns.map((vpn) => {
                  return (
                    <option key={`extranet-vpn-${vpn}`} value={vpn}>
                      {vpn}
                    </option>
                  );
                })}
            </Select>
          </Box>

          <Box marginLeft={4} alignSelf="center">
            <IconButton
              size="sm"
              aria-label="Add Extranet VPN"
              icon={<AddIcon />}
              onClick={() => {
                handleExtranetVpnAdd();
              }}
            />
          </Box>
        </Flex>
        {serviceState.extranetVpns.length > 0 && (
          <HStack>
            {serviceState.extranetVpns.map((vpn) => {
              return (
                <Tag key={`selected-extranet-vpn-${vpn}`} size="lg">
                  <TagLabel>{vpn}</TagLabel>
                  <TagCloseButton onClick={() => handleExtranetVpnRemove(vpn)} />
                </Tag>
              );
            })}
          </HStack>
        )}
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

export default VpnServiceForm;
