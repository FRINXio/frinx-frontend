import React, { FC, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, useTheme } from '@chakra-ui/react';
import { ExtendedTask, HTTPInputParams, HTTPMethod } from '../../helpers/types';
import Editor from '../common/editor';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: HTTPInputParams;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (p: HTTPInputParams) => void;
};

function getBodyFromRequest(params: HTTPInputParams): string | null {
  if (params.http_request.method !== 'GET') {
    return params.http_request.body;
  }
  return null;
}

const HTTPInputsForm: FC<Props> = ({ params, onChange, tasks, task }) => {
  const { contentType, method, uri, timeout, headers } = params.http_request;
  const body = getBodyFromRequest(params);
  const theme = useTheme();

  const [uriVal, setUriVal] = useState(uri);

  const handleOnChange = (updatedInputValue: string) => {
    setUriVal(updatedInputValue);

    onChange({
      ...params,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      http_request: {
        ...params.http_request,
        uri: updatedInputValue,
      },
    });
  };

  return (
    <>
      <FormControl id="uri" my={6}>
        <FormLabel>URI</FormLabel>
        <AutocompleteTaskReferenceNameMenu tasks={tasks} task={task} inputValue={uriVal} onChange={handleOnChange}>
          <Input
            autoComplete="off"
            variant="filled"
            name="uri"
            value={uriVal}
            onChange={(event) => {
              event.persist();
              handleOnChange(event.target.value);
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
      </FormControl>
      <FormControl id="method" my={6}>
        <FormLabel>Method</FormLabel>
        <Select
          variant="filled"
          name="method"
          value={method}
          onChange={(event) => {
            event.persist();
            const eventValue = event.target.value as HTTPMethod;
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                ...params.http_request,
                // we can safely cast this
                method: eventValue,
              },
            });
          }}
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="contentType" my={6}>
        <FormLabel>Content type</FormLabel>
        <Input
          variant="filled"
          name="contentType"
          value={contentType}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                ...params.http_request,
                contentType: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="timeout" my={6}>
        <Box w="50%">
          <FormLabel>Timeout</FormLabel>
          <Input
            variant="filled"
            name="timeout"
            value={timeout}
            onChange={(event) => {
              event.persist();
              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  timeout: Number(event.target.value),
                },
              });
            }}
          />
        </Box>
      </FormControl>
      <FormControl id="headers">
        <FormLabel>Headers</FormLabel>
        <Editor
          name="headers"
          value={JSON.stringify(headers, null, 2)}
          onChange={(value) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                ...params.http_request,
                headers: JSON.parse(value),
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
      {method !== 'GET' && (
        <FormControl id="body" my={6}>
          <FormLabel>Body</FormLabel>
          <Editor
            name="body"
            value={JSON.stringify(body, null, 2) ?? ''}
            onChange={(value) => {
              if (params.http_request.method === 'GET') {
                return;
              }
              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  body: value,
                },
              });
            }}
            enableBasicAutocompletion
            height="200px"
            style={{
              borderRadius: theme.radii.md,
            }}
          />
        </FormControl>
      )}
    </>
  );
};

export default HTTPInputsForm;
