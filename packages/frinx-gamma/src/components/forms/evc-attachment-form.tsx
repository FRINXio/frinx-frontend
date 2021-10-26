import { Button, Divider, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState, VoidFunctionComponent } from 'react';
import { EvcAttachment } from './bearer-types';

type Props = {
  evcAttachment: EvcAttachment;
  onSubmit: (attachment: EvcAttachment) => void;
  onCancel: () => void;
};

const EvcAttachmentForm: VoidFunctionComponent<Props> = ({ evcAttachment, onSubmit, onCancel }) => {
  const [evc, setEvc] = useState<EvcAttachment>(evcAttachment);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(evc);
  };

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
        <FormLabel>Circuit Reference</FormLabel>
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
        <FormLabel>Carrier Reference</FormLabel>
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

      <FormControl id="qos-input-profile" my={6}>
        <FormLabel>Qos Input Profile</FormLabel>
        <Input
          variant="filled"
          name="customer-name"
          value={evc.qosInputProfile || ''}
          onChange={(event) => {
            setEvc({
              ...evc,
              qosInputProfile: event.target.value || null,
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
