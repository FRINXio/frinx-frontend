import React, { FC, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  HStack,
  Tag,
  Box,
  Divider,
  Button,
  Stack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  IconButton,
  Input,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { uniqBy } from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { VpnServiceTopology, DefaultCVlanEnum, VpnService } from './service-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { getSelectOptions } from './options.helper';

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

const ServiceSchema = yup.object().shape({
  vpnId: yup.string().nullable(),
  customerName: yup.string().required('Customer Name is required'),
  vpnServiceTopology: yup.mixed().oneOf(['any-to-any', 'hub-spoke', 'hub-spoke-disjointed', 'custom']),
  defaultCVlan: yup.mixed().oneOf(['400', '1000', '50', 'custom']),
  customCVlan: yup.number().nullable().when('defaultCVlan', {
    is: 'custom',
    then: yup.number().required(),
    otherwise: yup.number().nullable(),
  }),
  extranetVpns: yup.array().of(yup.string()),
});

const VpnServiceForm: FC<Props> = ({ extranetVpns, service, services, onSubmit, onCancel }) => {
  const { values, errors, dirty, setFieldValue, handleSubmit, setValues } = useFormik({
    initialValues: {
      ...service,
    },
    validationSchema: ServiceSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });
  const [extranetVpnSelect, setExtranetVpnSelect] = useState<string | null>(null);
  const [customerItems, setCustomerItems] = useState<Item[]>(getCustomerItems(services));

  // useEffect(() => {
  //   setServiceState({
  //     ...service,
  //   });
  // }, [service]);

  const handleCustomerChange = (customerName?: Item | null) => {
    if (!customerName) {
      return;
    }
    setFieldValue('customerName', customerName.value);
  };

  const handleExtranetVpnAdd = () => {
    if (!extranetVpnSelect) {
      return;
    }
    const newExtranetVpns = [...values.extranetVpns, extranetVpnSelect];
    setValues({ ...values, extranetVpns: newExtranetVpns });
    setExtranetVpnSelect(null);
  };

  const handleExtranetVpnRemove = (vpn: string) => {
    const newExtranetVpns = [...values.extranetVpns].filter((v) => v !== vpn);
    setValues({ ...values, extranetVpns: newExtranetVpns });
  };

  const handleDeselectCustomerName = () => {
    setFieldValue('customerName', '');
  };

  const handleCreateItem = (item: Item) => {
    setCustomerItems([...customerItems, item]);
    setFieldValue('customerName', item.value);
  };

  const filteredExtranetVpns = extranetVpns.filter((ev) => {
    return !values.extranetVpns.includes(ev);
  });

  const [selectedCustomerItem] = customerItems.filter((ci) => ci.value === values.customerName);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="customerName" my={6} isRequired isInvalid={errors.customerName != null}>
        <FormLabel>VPN Description</FormLabel>
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
        {errors.customerName && <FormErrorMessage>{errors.customerName}</FormErrorMessage>}
      </FormControl>
      <FormControl id="vpnServiceTopology" my={6}>
        <FormLabel>Vpn Service Topology</FormLabel>
        <Select
          name="vpnServiceTopology"
          value={values.vpnServiceTopology}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as VpnServiceTopology;
            setFieldValue('vpnServiceTopology', eventValue);
          }}
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.service.vpn_topology).map((item) => {
            return (
              <option key={`topology-${item.key}`} value={item.label}>
                {item.key}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl id="defaultCVlan" my={6}>
        <FormLabel>Default C Vlan</FormLabel>
        <Select
          name="defaultCVlan"
          value={values.defaultCVlan}
          onChange={(event) => {
            event.persist();
            const defaultCVlan = event.target.value as unknown as DefaultCVlanEnum;
            setFieldValue('defaultCVlan', defaultCVlan);
          }}
        >
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.service.default_cvlan).map((item) => {
            return (
              <option key={`default-cvlan-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      {values.defaultCVlan === 'custom' && (
        <FormControl id="custom-c-vlan" my={6} isRequired isInvalid={errors.customCVlan != null}>
          <FormLabel>Custom C-VLAN</FormLabel>
          <Input
            name="customCVlan"
            value={values.customCVlan || ''}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isNaN(value)) {
                return;
              }
              setFieldValue('customCVlan', value);
            }}
          />
          {errors.customCVlan && <FormErrorMessage>{errors.customCVlan}</FormErrorMessage>}
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
        {values.extranetVpns.length > 0 && (
          <HStack>
            {values.extranetVpns.map((vpn) => {
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
        <Button type="submit" colorScheme="blue" isDisabled={!dirty}>
          Save changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default VpnServiceForm;
