import { Button, Divider, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
import { useFormik, Field } from 'formik';
import { EvcAttachment } from './bearer-types';
import Autocomplete2, { Item } from '../autocomplete-2/autocomplete-2';

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
  // const [evc, setEvc] = useState<EvcAttachment>(evcAttachment);
  const formik = useFormik({
    initialValues: {
      ...evcAttachment,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // onSubmit(evc);
  };

  const profileItems = getQosProfilesItems(qosProfiles);
  const [selectedProfile] = profileItems.filter((p) => {
    return p.value === formik.values.qosInputProfile;
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl id="evc-type" my={6}>
        <FormLabel>Evc Type</FormLabel>
        <Select variant="filled" name="evcType" value={formik.values.evcType} onChange={formik.handleChange}>
          <option value="evc-point-to-point">point-to-point</option>
          <option value="evc-multipoint">multipoint</option>
        </Select>
      </FormControl>

      <FormControl id="circuit-reference" my={6}>
        <FormLabel>BMT Circuit Reference</FormLabel>
        <Input
          variant="filled"
          name="circuitReference"
          value={formik.values.circuitReference}
          onChange={formik.handleChange}
        />
      </FormControl>

      <FormControl id="carrierReference" my={6}>
        <FormLabel>Carrier Circuit Reference</FormLabel>
        <Input
          variant="filled"
          name="carrierReference"
          value={formik.values.carrierReference || ''}
          onChange={formik.handleChange}
        />
      </FormControl>

      <FormControl id="svlanId" my={6}>
        <FormLabel>Svlan Id</FormLabel>
        <Input
          variant="filled"
          name="svlanId"
          value={formik.values.svlanId || ''}
          disabled
          onChange={(event) => {
            const svlanId = Number(event.target.value);
            if (Number.isNaN(svlanId)) {
              return;
            }
            formik.handleChange(svlanId || null);
          }}
        />
      </FormControl>

      <FormControl id="inputBandwidth" my={6}>
        <FormLabel>Input Bandwidth</FormLabel>
        <Input
          variant="filled"
          name="inputBandwidth"
          value={formik.values.inputBandwidth}
          onChange={(event) => {
            console.log(event);
            console.log(event.currentTarget.value);
            const inputBandwidth = Number(event.currentTarget.value);
            if (Number.isNaN(inputBandwidth)) {
              return;
            }
            formik.handleChange(event);
          }}
        />
      </FormControl>

      <FormControl id="qosProfile" my={6}>
        <FormLabel>QOS Profile</FormLabel>
        <Autocomplete2
          items={profileItems}
          selectedItem={selectedProfile}
          onChange={(item) => {
            formik.handleChange(item);
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

export default EvcAttachmentForm;
