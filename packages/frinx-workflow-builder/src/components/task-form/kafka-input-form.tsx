import React, { FC } from 'react';
import { FormControl, FormLabel, Input, Select, useTheme } from '@chakra-ui/react';
import { ExtendedTask, KafkaPublishInputParams, HTTPMethod } from '../../helpers/types';
import Editor from '../common/editor';

type Props = {
  params: KafkaPublishInputParams;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: KafkaPublishInputParams) => void;
};

const serializerOptions = new Map([
  ['org.apache.kafka.common.serialization.IntegerSerializer', 'IntegerSerializer'],
  ['org.apache.kafka.common.serialization.LongSerializer', 'LongSerializer'],
  ['org.apache.kafka.common.serialization.StringSerializer', 'StringSerializer'],
]);

const KafkaPublishInputsForm: FC<Props> = ({ params, onChange }) => {
  const { topic, key, value, keySerializer, requestTimeoutMs, maxBlockMs, bootStrapServers, headers } =
    params.kafka_request;
  const theme = useTheme();

  return (
    <>
      <FormControl id="topic" my={6}>
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
            const eventValue = event.target.value as HTTPMethod;
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
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
          {[...serializerOptions.entries()].map((entry) => {
            const [k, v] = entry;
            return (
              <option key={k} value={v}>
                {v}
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
          value={requestTimeoutMs}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                requestTimeoutMs: Number(event.target.value),
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
          value={maxBlockMs}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                maxBlockMs: Number(event.target.value),
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="headers">
        <FormLabel>Headers</FormLabel>
        <Editor
          name="headers"
          value={JSON.stringify(headers, null, 2)}
          onChange={(v) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              kafka_request: {
                ...params.kafka_request,
                headers: JSON.parse(v),
              },
            });
          }}
          enableBasicAutocompletion
          height="100px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
    </>
  );
};

export default KafkaPublishInputsForm;
