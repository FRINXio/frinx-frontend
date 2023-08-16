import { Box, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import { Editor, ExtendedTask, HTTPInputParams, HTTPMethod } from '@frinx/shared';
import { FormikErrors } from 'formik';
import React, { FC, useState } from 'react';
import * as yup from 'yup';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const HttpInputParamsSchema = yup.object({
  inputParameters: yup.object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    http_request: yup.object({
      uri: yup.string().required('Please enter task URI'),
      method: yup.string().required('Please enter task method'),
      contentType: yup.string().required('Please enter task content type'),
      timeout: yup.string().required('Please enter task timeout'),
    }),
  }),
});

type Props = {
  params: HTTPInputParams;
  errors: FormikErrors<{ inputParameters: HTTPInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (params: HTTPInputParams) => void;
};

function getBodyFromRequest(params: HTTPInputParams): string | null {
  if (params.http_request.method !== 'GET') {
    return params.http_request.body;
  }
  return null;
}

const HTTPInputsForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  const { contentType, method, uri, timeout, headers } = params.http_request;
  const body = getBodyFromRequest(params);

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

  const language = contentType === 'application/json' ? 'json' : 'plaintext';

  return (
    <>
      <FormControl id="uri" my={6} isInvalid={errors.inputParameters?.http_request?.uri != null}>
        <FormLabel>URI</FormLabel>
        <AutocompleteTaskReferenceNameMenu tasks={tasks} task={task} inputValue={uriVal} onChange={handleOnChange}>
          <Input
            autoComplete="off"
            variant="filled"
            name="uri"
            value={params.http_request.uri}
            onChange={(event) => {
              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  uri: event.target.value,
                },
              });
            }}
          />
        </AutocompleteTaskReferenceNameMenu>
        <FormErrorMessage>{errors.inputParameters?.http_request?.uri}</FormErrorMessage>
      </FormControl>
      <FormControl id="method" my={6} isInvalid={errors.inputParameters?.http_request?.method != null}>
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                ...params.http_request,
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
        <FormErrorMessage>{errors.inputParameters?.http_request?.method}</FormErrorMessage>
      </FormControl>
      <FormControl id="contentType" my={6} isInvalid={errors.inputParameters?.http_request?.contentType != null}>
        <FormLabel>Content type</FormLabel>
        <Select
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
        >
          <option value="application/json">application/json</option>

          <option value="text/plain">text/plain</option>
        </Select>

        <FormErrorMessage>{errors.inputParameters?.http_request?.contentType}</FormErrorMessage>
      </FormControl>
      <FormControl id="timeout" my={6} isInvalid={errors.inputParameters?.http_request?.timeout != null}>
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
        <FormErrorMessage>{errors.inputParameters?.http_request?.timeout}</FormErrorMessage>
      </FormControl>
      <FormControl id="headers">
        <FormLabel>Headers</FormLabel>
        <Editor
          value={JSON.stringify(headers, null, 2)}
          onChange={(value) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                ...params.http_request,
                headers: JSON.parse(value ?? ''),
              },
            });
          }}
          height="100px"
        />
      </FormControl>
      {method !== 'GET' && (
        <FormControl id="body" my={6}>
          <FormLabel>Body</FormLabel>
          <Editor
            language={language}
            value={body ?? ''}
            onChange={(value) => {
              if (params.http_request.method === 'GET') {
                return;
              }
              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  body: value ?? '',
                },
              });
            }}
            height="200px"
          />
        </FormControl>
      )}
    </>
  );
};

export default HTTPInputsForm;
