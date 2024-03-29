import { Box, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import { Editor, ExtendedTask, GraphQLInputParams } from '@frinx/shared';
import { FormikErrors } from 'formik';
import React, { FC, useState } from 'react';
import * as yup from 'yup';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

export const GraphQLInputParamsSchema = yup.object({
  inputParameters: yup.object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    http_request: yup.object({
      uri: yup.string().required('Please enter task URI'),
      method: yup.string().required('Please enter task method'),
      contentType: yup.string().required('Please enter task content type'),
      timeout: yup.string().required('Please enter task timeout'),
      body: yup.object({
        query: yup.string().required(),
        variables: yup.object().shape({}),
      }),
      headers: yup.object().shape({}),
    }),
  }),
});

type Props = {
  params: GraphQLInputParams;
  errors: FormikErrors<{ inputParameters: GraphQLInputParams }>;
  tasks: ExtendedTask[];
  task: ExtendedTask;
  onChange: (params: GraphQLInputParams) => void;
};

const GraphQLInputsForm: FC<Props> = ({ params, errors, onChange, tasks, task }) => {
  const { contentType, method, uri, body, timeout, headers } = params.http_request;
  const { query, variables } = body;

  const [uriVal, setUriVal] = useState(uri);

  const handleOnChange = (updatedInputValue: string): void => {
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
      <FormControl id="uri" my={6} isInvalid={errors.inputParameters?.http_request?.uri != null}>
        <FormLabel>URI</FormLabel>
        <AutocompleteTaskReferenceNameMenu tasks={tasks} task={task} onChange={handleOnChange} inputValue={uriVal}>
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
        <FormErrorMessage>{errors.inputParameters?.http_request?.uri}</FormErrorMessage>
      </FormControl>
      <FormControl id="method" my={6} isInvalid={errors.inputParameters?.http_request?.method != null}>
        <FormLabel>Method</FormLabel>
        <Select variant="filled" isDisabled name="method" defaultValue={method}>
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
          language="json"
          value={JSON.stringify(headers)}
          onChange={(value) => {
            try {
              const parsedValue = JSON.parse(value ?? '');

              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  headers: parsedValue,
                },
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
          height="100px"
        />
      </FormControl>
      <FormControl id="query" my={6}>
        <FormLabel>GraphQL query</FormLabel>
        <Editor
          language="graphqlschema"
          value={query}
          onChange={(value) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                ...params.http_request,
                body: {
                  ...params.http_request.body,
                  query: value ?? '',
                },
              },
            });
          }}
          height="200px"
        />
      </FormControl>
      <FormControl id="variables">
        <FormLabel>Variables</FormLabel>
        <Editor
          language="json"
          value={JSON.stringify(variables, null, 2)}
          onChange={(value) => {
            try {
              const parsedValue = JSON.parse(value ?? '');

              onChange({
                ...params,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                http_request: {
                  ...params.http_request,
                  body: {
                    ...params.http_request.body,
                    variables: parsedValue,
                  },
                },
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
          height="100px"
        />
      </FormControl>
    </>
  );
};

export default GraphQLInputsForm;
