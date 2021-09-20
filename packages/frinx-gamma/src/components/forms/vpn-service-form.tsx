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
  Input,
  Select,
  IconButton,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { VpnServiceTopology, DefaultCVlanEnum, VpnService, MaximumRoutes } from './service-types';
import Autocomplete from '../autocomplete/autocomplete';

type Props = {
  mode: 'add' | 'edit';
  services: VpnService[];
  service: VpnService;
  extranetVpns: string[];
  onSubmit: (s: VpnService) => void;
  onCancel: () => void;
  onServiceChange?: (s: VpnService) => void;
};

const VpnServiceForm: FC<Props> = ({ mode, extranetVpns, service, services, onSubmit, onCancel, onServiceChange }) => {
  const [serviceState, setServiceState] = useState(service);
  const [extranetVpnSelect, setExtranetVpnSelect] = useState<string | null>(null);

  useEffect(() => {
    setServiceState({
      ...service,
    });
  }, [service]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(serviceState);
  };

  const handleCustomerChange = (customerName: string) => {
    setServiceState({
      ...serviceState,
      customerName,
    });
    if (onServiceChange) {
      const [newService] = services.filter((s) => s.customerName === customerName);
      onServiceChange(newService);
    }
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

  const filteredExtranetVpns = extranetVpns.filter((ev) => {
    return !serviceState.extranetVpns.includes(ev);
  });

  const customerNames = services.map((s) => s.customerName).filter((s) => s !== serviceState.customerName);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="topic" my={6}>
        <FormLabel>Customer Name</FormLabel>
        {mode === 'add' ? (
          <>
            <Input
              variant="filled"
              name="topic"
              value={serviceState.customerName}
              onChange={(event) => {
                setServiceState({
                  ...serviceState,
                  customerName: event.target.value,
                });
              }}
            />
          </>
        ) : (
          <Autocomplete
            items={customerNames}
            selectedItem={serviceState.customerName}
            onChange={handleCustomerChange}
          />
        )}
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
          <option value="any-any">any-any</option>
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
      <FormControl id="maxiumRoutes" my={6}>
        <FormLabel>Maximum Routes</FormLabel>
        <Select
          variant="filled"
          name="maximumRoutes"
          value={serviceState.maximumRoutes}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as unknown as MaximumRoutes;
            setServiceState({
              ...serviceState,
              maximumRoutes: eventValue,
            });
          }}
        >
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
          <option value="1000000">1000000</option>
        </Select>
      </FormControl>

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
