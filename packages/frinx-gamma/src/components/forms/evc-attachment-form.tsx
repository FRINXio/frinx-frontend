import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Select, Stack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { EvcAttachment } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';
import { getSelectOptions } from './options.helper';

const EvcSchema = yup.object().shape({
  evcType: yup.string().required('Evc type is required'),
  circuitReference: yup
    .string()
    .matches(
      /(^CPNH2\d{8}-(0\d{2}|[1-9]\d{2,3})$)|(^CES\d{8}-\d{2}$)/,
      'Circuit Reference should have following format: CPNH200000000-0000 or CES00000000-00',
    )
    .required('Circuit Reference is required'),
  svlanId: yup.number().required('Svlan Id is required'),
  inputBandwidth: yup.number().required('Input Bandwidth is required'),
  carrierReference: yup.string().nullable(),
  qosInputProfiles: yup.string().nullable(),
});

type Props = {
  qosProfiles: string[];
  evcAttachment: EvcAttachment;
  onSubmit: (attachment: EvcAttachment) => void;
  onCancel: () => void;
};

function getQosProfilesItems(profiles: string[]): Item[] {
  return profiles.map((p) => ({
    value: p,
    label: p,
  }));
}

const EvcAttachmentForm: VoidFunctionComponent<Props> = ({ qosProfiles, evcAttachment, onSubmit, onCancel }) => {
  const { values, errors, dirty, resetForm, setFieldValue, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...evcAttachment,
    },
    validationSchema: EvcSchema,
    onSubmit: (formValues) => {
      onSubmit(formValues);
    },
  });

  const profileItems = getQosProfilesItems(qosProfiles);
  const [selectedProfile] = profileItems.filter((p) => {
    return p.value === values.qosInputProfile;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="evc-type" isRequired my={6} isDisabled>
        <FormLabel>EVC Type</FormLabel>
        <Select name="evcType" value={values.evcType} onChange={handleChange}>
          {getSelectOptions(window.__GAMMA_FORM_OPTIONS__.bearer.evc_type).map((item) => {
            return (
              <option key={`evc-type-${item.key}`} value={item.key}>
                {item.label}
              </option>
            );
          })}
        </Select>
      </FormControl>

      <FormControl id="circuit-reference" isRequired isInvalid={errors.circuitReference != null} my={6}>
        <FormLabel>BMT Circuit Reference</FormLabel>
        <Input
          placeholder="CPNH200000000-0000 or CES00000000-00"
          name="circuitReference"
          value={values.circuitReference}
          onChange={handleChange}
        />
        {errors.circuitReference && <FormErrorMessage>{errors.circuitReference}</FormErrorMessage>}
      </FormControl>

      <FormControl id="carrierReference" my={6}>
        <FormLabel>Carrier Circuit Reference</FormLabel>
        <Input name="carrierReference" value={values.carrierReference || ''} onChange={handleChange} />
      </FormControl>

      <FormControl id="svlanId" my={6} isRequired>
        <FormLabel>S-VLAN Identifier</FormLabel>
        <Input
          name="svlanId"
          value={values.svlanId || ''}
          disabled
          onChange={(event) => {
            const svlanId = Number(event.target.value);
            if (Number.isNaN(svlanId)) {
              return;
            }
            handleChange(svlanId || null);
          }}
        />
      </FormControl>

      <FormControl id="inputBandwidth" isRequired isInvalid={errors.inputBandwidth != null} my={6}>
        <FormLabel>Input Bandwidth</FormLabel>
        <Input
          name="inputBandwidth"
          value={values.inputBandwidth}
          onChange={(event) => {
            const inputBandwidth = Number(event.currentTarget.value);
            if (Number.isNaN(inputBandwidth)) {
              return;
            }
            handleChange(event);
          }}
        />
        {errors.inputBandwidth && <FormErrorMessage>{errors.inputBandwidth}</FormErrorMessage>}
      </FormControl>

      <FormControl id="qosInputProfile" my={6}>
        <FormLabel>QoS Profile</FormLabel>
        <Autocomplete2
          items={profileItems}
          selectedItem={selectedProfile}
          onChange={(item) => {
            setFieldValue('qosInputProfile', item?.value);
          }}
        />
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

export default EvcAttachmentForm;
