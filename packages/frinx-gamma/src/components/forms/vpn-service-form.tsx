import React, { FC, useState, useEffect } from 'react';
import {
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
  Spinner,
  Text,
  IconButton,
  Input,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, LinkIcon } from '@chakra-ui/icons';
import { uniqBy } from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { VpnServiceTopology, DefaultCVlanEnum, VpnService } from './service-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { getSelectOptions } from './options.helper';
import { useAsyncGenerator } from '../commit-status-modal/commit-status-modal.helpers';

type VpnServiceWorkflowData = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_body: {
    text: string;
    counter: number;
  };
};

type Props = {
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

const freeResources = async (vpnId: string, counter: number) => {
  if (!vpnId || !counter) {
    return;
  }
  const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
  await uniflowCallbacks.executeWorkflow({
    name: 'Free_VpnServiceId',
    version: 1,
    input: {
      text: vpnId,
      counter,
    },
  });
};

const ServiceSchema = yup.object().shape({
  vpnId: yup.string().nullable(),
  customerName: yup.string().required('Customer Name is required'),
  vpnServiceTopology: yup.mixed().oneOf(['any-to-any', 'hub-spoke', 'hub-spoke-disjointed', 'custom']),
  defaultCVlan: yup.mixed().oneOf(['400', '1000', '50', 'custom']),
  customCVlan: yup
    .number()
    .nullable()
    .when('defaultCVlan', {
      is: 'custom',
      then: yup.number().min(1).max(4093).required(),
      otherwise: yup.number().nullable(),
    }),
  extranetVpns: yup.array().of(yup.string()),
});

const VpnServiceForm: FC<Props> = ({ extranetVpns, service, services, onSubmit, onCancel }) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [vpnId, setVpnId] = useState<string | null>(null);
  const [counter, setCounter] = useState<number | null>(null);
  const { values, errors, dirty, resetForm, setFieldValue, handleSubmit, setValues } = useFormik({
    initialValues: {
      ...service,
    },
    validationSchema: ServiceSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
      // we dont want to run Free_VpnServiceId on unmount aftert save
      setVpnId(null);
      setCounter(null);
    },
  });
  const [extranetVpnSelect, setExtranetVpnSelect] = useState<string | null>(null);
  const [customerItems, setCustomerItems] = useState<Item[]>(getCustomerItems(services));
  const onFinish = () => {
    // do nothing
  };
  const workflowPayload = useAsyncGenerator<VpnServiceWorkflowData>({ workflowId, onFinish });

  useEffect(() => {
    if (workflowId === workflowPayload?.workflowId && workflowPayload?.status === 'COMPLETED') {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { counter: responseCounter, text } = workflowPayload.output.response_body;
      if (!text || !responseCounter) {
        return;
      }
      setWorkflowId(null);
      setVpnId(text);
      setCounter(responseCounter);
      setFieldValue('vpnId', text);
    }
  }, [workflowPayload, workflowId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAssignVpnId = async () => {
    const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
    const workflowResult = await uniflowCallbacks.executeWorkflow({
      name: 'Allocate_VpnServiceId',
      version: 1,
      input: {},
    });
    setWorkflowId(workflowResult.text);
  };

  const handleReset = () => {
    if (vpnId !== null && counter !== null) {
      freeResources(vpnId, counter);
    }
    setVpnId(null);
    setCounter(null);
    resetForm();
  };

  const handleCancel = () => {
    if (vpnId !== null && counter !== null) {
      freeResources(vpnId, counter);
    }
    onCancel();
  };

  const filteredExtranetVpns = extranetVpns.filter((ev) => {
    return !values.extranetVpns.includes(ev);
  });

  const [selectedCustomerItem] = customerItems.filter((ci) => ci.value === values.customerName);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="vpn-id" my={6} isRequired isDisabled>
        <FormLabel>Vpn Id</FormLabel>
        <Flex justifyContent="space-between" alignItems="center">
          {workflowId && (
            <Flex alignItems="center">
              <Text paddingRight={1} color="blackAlpha.600" fontSize="sm" as="i">
                Fetching Vpn Id
              </Text>
              <Spinner size="sm" />
            </Flex>
          )}
        </Flex>
        <Flex>
          <Box flex="1">
            <Input
              name="vpnId"
              value={values.vpnId || ''}
              onChange={(event) => {
                setFieldValue('vpnId', event.target.value);
              }}
            />
          </Box>
          <Box marginLeft={4} alignSelf="center">
            <IconButton
              size="sm"
              aria-label="Assign Vpn ID"
              icon={<LinkIcon />}
              onClick={handleAssignVpnId}
              isDisabled={workflowId !== null}
            />
          </Box>
        </Flex>
      </FormControl>
      <FormControl id="customerName" my={6} isRequired isInvalid={errors.customerName != null}>
        <FormLabel>Customer Name / VPN Description</FormLabel>
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
        <FormLabel>VPN Service Topology</FormLabel>
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
        <FormLabel>Default C-VLAN</FormLabel>
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
          <FormLabel>Custom C-VLAN Identifier</FormLabel>
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
        <Button onClick={() => handleReset()}>Clear</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default VpnServiceForm;
