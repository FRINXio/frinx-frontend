import { Button, Divider, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
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
  const [evc, setEvc] = useState<EvcAttachment>(evcAttachment);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(evc);
  };

  const profileItems = getQosProfilesItems(qosProfiles);
  const [selectedProfile] = profileItems.filter((p) => {
    return p.value === evc.qosInputProfile;
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="evc-type" my={6}>
        <FormLabel>Evc Type</FormLabel>
        <Select
          variant="filled"
          name="site-device-id"
          value={evc.evcType}
          onChange={(event) => {
            setEvc({
              ...evc,
              evcType: event.target.value,
            });
          }}
        >
          <option value="evc-point-to-point">point-to-point</option>
          <option value="evc-multipoint">multipoint</option>
        </Select>
      </FormControl>

      <FormControl id="circuit-reference" my={6}>
        <FormLabel>BMT Circuit Reference</FormLabel>
        <Input
          variant="filled"
          name="circuit-reference"
          value={evc.circuitReference}
          onChange={(event) => {
            setEvc({
              ...evc,
              circuitReference: event.target.value,
            });
          }}
        />
      </FormControl>

      <FormControl id="carrier-reference" my={6}>
        <FormLabel>Carrier Circuit Reference</FormLabel>
        <Input
          variant="filled"
          name="carrier-reference"
          value={evc.carrierReference || ''}
          onChange={(event) => {
            setEvc({
              ...evc,
              carrierReference: event.target.value || null,
            });
          }}
        />
      </FormControl>

      <FormControl id="customer-name" my={6}>
        <FormLabel>Customer Name</FormLabel>
        <Input
          variant="filled"
          name="customer-name"
          value={evc.customerName || ''}
          onChange={(event) => {
            setEvc({
              ...evc,
              customerName: event.target.value || null,
            });
          }}
        />
      </FormControl>

      <FormControl id="svlan-id" my={6}>
        <FormLabel>Svlan Id</FormLabel>
        <Input
          variant="filled"
          name="svlan-id"
          value={evc.svlanId || ''}
          disabled
          onChange={(event) => {
            const svlanId = Number(event.target.value);
            if (Number.isNaN(svlanId)) {
              return;
            }
            setEvc({
              ...evc,
              svlanId: svlanId || null,
            });
          }}
        />
      </FormControl>

      <FormControl id="input-bandwidth" my={6}>
        <FormLabel>Input Bandwidth</FormLabel>
        <Input
          variant="filled"
          name="input-bandwidth"
          value={evc.inputBandwidth}
          onChange={(event) => {
            const inputBandwidth = Number(event.target.value);
            if (Number.isNaN(inputBandwidth)) {
              return;
            }
            setEvc({
              ...evc,
              inputBandwidth,
            });
          }}
        />
      </FormControl>

      <FormControl id="qos-profile" my={6}>
        <FormLabel>QOS Profile</FormLabel>
        <Autocomplete2
          items={profileItems}
          selectedItem={selectedProfile}
          onChange={(item) => {
            setEvc({
              ...evc,
              qosInputProfile: item ? item.value : null,
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

export default EvcAttachmentForm;
