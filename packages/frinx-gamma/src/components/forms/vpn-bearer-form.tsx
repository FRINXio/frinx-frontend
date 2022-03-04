import React, { VoidFunctionComponent } from 'react';
import { Divider, Button, Input, Select, Stack, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { FormikErrors, useFormik } from 'formik';
import * as yup from 'yup';
import { VpnSite } from './site-types';
import { VpnBearer, VpnCarrier, VpnNode } from './bearer-types';
import CarrierForm from './carrier-form';
import ConnectionForm from './connection-form';
import Autocomplete2 from '../autocomplete-2/autocomplete-2';
import { Connection } from '../../network-types';

const CarrierSchema = yup.object().shape({
  carrierName: yup.string().nullable(),
  carrierReference: yup.string().nullable(),
  serviceType: yup.string().nullable(),
  serviceStatus: yup.string().nullable(),
});
const ConnectionSchema = yup.object().shape({
  encapsulationType: yup.string().nullable(),
  svlanAssignmentType: yup.string().nullable(),
  tpId: yup.string().nullable(),
  mtu: yup
    .number()
    .min(1000, 'mtu must be greater than or equal to 1000')
    .max(9000, 'mtu must be less than or equal to 9000')
    .required('Mtu is required'),
  remoteNeId: yup.string().nullable(),
  remotePortId: yup.string().nullable(),
});
const BearerSchema = yup.object().shape({
  spBearerReference: yup.string().required('spBearerReference is required'),
  neId: yup.string().required('Ne Id is required'),
  portId: yup.string().required('Port Id is required'),
  description: yup.string().nullable(),
  carrier: CarrierSchema.nullable(),
  connection: ConnectionSchema.nullable(),
});

type Props = {
  mode: 'add' | 'edit';
  nodes: VpnNode[];
  carriers: VpnCarrier[];
  bearer: VpnBearer;
  onSubmit: (s: VpnBearer) => void;
  onCancel: () => void;
  onSiteChange?: (s: VpnSite) => void;
};

const VpnBearerForm: VoidFunctionComponent<Props> = ({ mode, nodes, carriers, bearer, onSubmit, onCancel }) => {
  const { values, errors, dirty, isValid, resetForm, setFieldValue, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...bearer,
    },
    validationSchema: BearerSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  const nodeItems = nodes.map((n) => ({
    value: n.neId,
    label: `${n.neId} (${n.routerId})`,
  }));
  const [selectedNode] = nodeItems.filter((n) => {
    return n.value === values.neId;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="ne-id" my={6} isRequired isInvalid={errors.neId != null}>
        <FormLabel>VPN Node</FormLabel>
        <Autocomplete2
          items={nodeItems}
          selectedItem={selectedNode}
          onChange={(item) => {
            setFieldValue('neId', item ? item.value : null);
          }}
        />
        {errors.neId && <FormErrorMessage>{errors.neId}</FormErrorMessage>}
      </FormControl>
      <FormControl id="port-id" my={6} isRequired isInvalid={errors.portId != null}>
        <FormLabel>Port ID</FormLabel>
        <Select name="portId" value={values.portId} onChange={handleChange}>
          <option value="">-- choose port id</option>
          {[...Array(8).keys()].map((v) => {
            return <option key={`port-id-xe-${v}`} value={`xe-0/1/${v}`}>{`xe-0/1/${v}`}</option>;
          })}
        </Select>
        {errors.portId && <FormErrorMessage>{errors.portId}</FormErrorMessage>}
      </FormControl>
      <FormControl id="admin-status" my={6}>
        <FormLabel>Admin Status</FormLabel>
        <Select
          name="status"
          value={values.status?.adminStatus?.status || ''}
          onChange={(event) => {
            const { value } = event.currentTarget;
            const oldBearerStatus = values.status || {
              adminStatus: null,
              operStatus: null,
            };
            const newBearerStatus = {
              ...oldBearerStatus,
              adminStatus: {
                status: value,
              },
            };

            setFieldValue('status', newBearerStatus);
          }}
        >
          <option value="">-- choose admin state</option>
          <option value="gamma-vpn-common:administrative-state-testing">administrative-state-testing</option>
          <option value="gamma-vpn-common:administrative-state-pre-deployment">
            administrative-state-pre-deployment
          </option>
          <option value="gamma-vpn-common:administrative-state-up">administrative-state-up</option>
          <option value="gamma-vpn-common:administrative-state-down">administrative-state-down</option>
        </Select>
        {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
      </FormControl>
      <FormControl id="sp-bearer-reference" my={6} isRequired isInvalid={errors.spBearerReference != null}>
        <FormLabel>Gamma Hublink ID</FormLabel>
        <Input
          name="spBearerReference"
          value={values.spBearerReference}
          disabled={mode === 'edit'}
          onChange={handleChange}
        />
        {errors.spBearerReference && <FormErrorMessage>{errors.spBearerReference}</FormErrorMessage>}
      </FormControl>
      <FormControl id="description" my={6}>
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          value={values.description || ''}
          onChange={(event) => {
            setFieldValue('description', event.target.value || null);
          }}
        />
      </FormControl>

      <CarrierForm
        carriers={carriers}
        carrier={
          values.carrier || { carrierName: null, carrierReference: null, serviceType: null, serviceStatus: null }
        }
        errors={errors}
        onChange={(carrier) => {
          setFieldValue('carrier', carrier);
        }}
      />
      <ConnectionForm
        connection={
          values.connection || {
            tpId: null,
            svlanAssignmentType: null,
            encapsulationType: null,
            mtu: 0,
            remoteNeId: null,
            remotePortId: null,
          }
        }
        errors={errors.connection as FormikErrors<Connection>}
        onChange={(connection) => {
          setFieldValue('connection', connection);
        }}
      />

      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!dirty || !isValid}>
          Save changes
        </Button>
        <Button onClick={() => resetForm()}>Clear</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default VpnBearerForm;
