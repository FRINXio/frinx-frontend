import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import React, { FC, FormEvent, useState } from 'react';
import Editor from 'react-ace';
import { Device, Zone } from '../../helpers/types';

type Props = {
  device: Device;
  mountParameters: string;
  onSubmit: (device: Device, mountParameters: string) => void;
};

type DeviceValidationErrors = {
  name: string | null;
  zone: string | null;
};

const INITIAL_DEVICE_VALIDATION_ERRORS = {
  name: null,
  zone: null,
};

const zones = [] as Zone[];

const CreateDeviceForm: FC<Props> = ({ device, onSubmit, mountParameters }) => {
  const [deviceState, setDeviceState] = useState(device);
  const [mountParams, setMountParams] = useState(mountParameters);

  const [errors, setErrors] = useState<DeviceValidationErrors>(INITIAL_DEVICE_VALIDATION_ERRORS);

  const handleSubmit = () => {
    if (!deviceState.name) {
      setErrors((prevState) => {
        return { ...prevState, name: 'Please enter name of device' };
      });
    }
    if (!deviceState.zone.id) {
      setErrors((prevState) => {
        return { ...prevState, zone: 'Please enter zone of device' };
      });
    }

    if (!deviceState.name || !deviceState.zone) return;

    onSubmit(deviceState, mountParams);
  };

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormControl id="name" my={6} isInvalid={errors.name !== null}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter name of device"
          onChange={(event) => {
            event.persist();
            setDeviceState((dvc) => ({ ...dvc, name: event.target.value }));
          }}
          name="name"
          value={deviceState.name}
        />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl id="zone" marginY={5} isInvalid={errors.zone !== null}>
        <FormLabel>Zone</FormLabel>
        <Select
          onChange={(event) => {
            event.persist();
            const zone = zones.find((zn) => zn.id === event.target.value);
            setDeviceState((dvc) => ({ ...dvc, zone }));
          }}
          name="zone"
          placeholder="Select zone of device"
        >
          {zones.map((zone: Zone) => (
            <option key={zone.id} value={zone.id} selected={zones.length === 1}>
              {zone.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.zone}</FormErrorMessage>
      </FormControl>

      <FormControl my={6}>
        <FormLabel>Mount parameters</FormLabel>
        <Editor
          height="450px"
          width="100%"
          mode="json"
          theme="tomorrow"
          editorProps={{ $blockScrolling: true }}
          fontSize={16}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          onChange={(value) => {
            try {
              const parsedParams = JSON.parse(value);
              setMountParams(parsedParams);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Bad JSON format');
            }
          }}
          value={JSON.stringify(mountParams, null, 2)}
        />
      </FormControl>

      <Divider my={6} />
      <Button type="submit" colorScheme="blue" onClick={handleSubmit}>
        Create device
      </Button>
    </form>
  );
};

export default CreateDeviceForm;
