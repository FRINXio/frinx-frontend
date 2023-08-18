import { FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import { Editor, ExtendedTask, KafkaPublishInputParams, SerializerEnum } from '@frinx/shared';
import { FormikErrors } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';

export const KafkaPublishInputParamsSchema = yup.object({
  inputParameters: yup.object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    kafka_request: yup.object({
      topic: yup.string(),
      value: yup.string(),
      requestTimeoutMs: yup.number(),
      maxBlockMs: yup.number(),
      bootStrapServers: yup.string(),
      headers: yup.object().shape({}),
      key: yup.string(),
      keySerializer: yup.string(),
    }),
  }),
});

type Props = {
  params: KafkaPublishInputParams;
  errors: FormikErrors<{ inputParameters: KafkaPublishInputParams }>;
  tasks: ExtendedTask[]; // eslint-disable-line react/no-unused-prop-types
  task: ExtendedTask; // eslint-disable-line react/no-unused-prop-types
  onChange: (p: KafkaPublishInputParams) => void;
};

const KafkaPublishInputsForm: FC<Props> = ({ params, errors, onChange }) => {
  const { topic, key, value, keySerializer, requestTimeoutMs, maxBlockMs, bootStrapServers, headers } =
    params.kafka_request;

  return (
    <>
      <FormControl id="topic" my={6} isInvalid={errors.inputParameters?.kafka_request?.topic != null}>
        <FormLabel>Topic</FormLabel>
        <Input
          variant="filled"
          name="topic"
          value={topic}
          onChange={(event) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                topic: event.target.value,
              },
            });
          }}
        />
        <FormErrorMessage>{errors.inputParameters?.kafka_request?.topic}</FormErrorMessage>
      </FormControl>
      <FormControl id="key" my={6}>
        <FormLabel>Key</FormLabel>
        <Input
          variant="filled"
          name="key"
          value={key}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                key: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="value" my={6}>
        <FormLabel>Value</FormLabel>
        <Input
          variant="filled"
          name="value"
          value={value}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                value: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="keySerializer" my={6}>
        <FormLabel>Key Serializer</FormLabel>
        <Select
          variant="filled"
          name="keySerializer"
          value={keySerializer}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as SerializerEnum;
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // eslint-disable-next-line
              kafka_request: {
                //
                // eslint-disable-next-line @typescript-eslint/naming-convention
                ...params.kafka_request,
                // we can safely cast this
                keySerializer: eventValue,
              },
            });
          }}
        >
          {[...Object.entries(SerializerEnum)].map((e) => {
            const [k, v] = e;
            return (
              <option key={k} value={v}>
                {k}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl id="bootstrapServers" my={6}>
        <FormLabel>Bootstrap Servers</FormLabel>
        <Input
          variant="filled"
          name="bootstrapServers"
          value={bootStrapServers}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                bootStrapServers: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="requestTimeoutMs" my={6}>
        <FormLabel>Request Timeout (ms)</FormLabel>
        <Input
          variant="filled"
          name="requestTimeoutMs"
          value={requestTimeoutMs || ''}
          onChange={(event) => {
            event.persist();
            const eventValue = Number(event.target.value);
            if (Number.isNaN(eventValue)) {
              return;
            }
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                requestTimeoutMs: eventValue || undefined,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="maxBlockMs" my={6}>
        <FormLabel>Max Block (ms)</FormLabel>
        <Input
          variant="filled"
          name="maxBlockMs"
          value={maxBlockMs || ''}
          onChange={(event) => {
            event.persist();
            const eventValue = Number(event.target.value);
            if (Number.isNaN(eventValue)) {
              return;
            }
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                maxBlockMs: eventValue || undefined,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="headers">
        <FormLabel>Headers</FormLabel>
        <Editor
          value={JSON.stringify(headers, null, 2)}
          onChange={(v) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                headers: JSON.parse(v ?? ''),
              },
            });
          }}
          height="100px"
        />
      </FormControl>
    </>
  );
};

export default KafkaPublishInputsForm;
