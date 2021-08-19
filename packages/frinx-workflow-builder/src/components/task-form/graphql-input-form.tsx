import React, { FC, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, useTheme } from '@chakra-ui/react';
import { ExtendedTask, GraphQLInputParams } from '../../helpers/types';
import Editor from '../common/editor';
import AutocompleteTaskReferenceNameMenu from '../autocomplete-task-reference-name/autocomplete-task-reference-name-menu';

type Props = {
  params: GraphQLInputParams;
  tasks: ExtendedTask[];
  onChange: (params: GraphQLInputParams) => void;
};

const GraphQLInputsForm: FC<Props> = ({ params, onChange, tasks }) => {
  const { contentType, method, uri, body, timeout, headers } = params.http_request;
  const { query, variables } = body;
  const theme = useTheme();

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
      <FormControl id="uri" my={6}>
        <FormLabel>URI</FormLabel>
        <AutocompleteTaskReferenceNameMenu tasks={tasks} onChange={handleOnChange} inputValue={uriVal}>
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
        <Select variant="filled" isDisabled name="method" defaultValue={method}>
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
          mode="json"
          name="headers"
          value={JSON.stringify(headers)}
          onChange={(value) => {
            try {
              const parsedValue = JSON.parse(value);

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
              console.error(error.message);
            }
          }}
          height="100px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
      <FormControl id="query" my={6}>
        <FormLabel>GraphQL query</FormLabel>
        <Editor
          mode="graphqlschema"
          name="query"
          value={query}
          onChange={(value) => {
            onChange({
              ...params,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              http_request: {
                ...params.http_request,
                body: {
                  ...params.http_request.body,
                  query: value,
                },
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
      <FormControl id="variables">
        <FormLabel>Variables</FormLabel>
        <Editor
          mode="json"
          name="variables"
          value={JSON.stringify(variables, null, 2)}
          onChange={(value) => {
            try {
              const parsedValue = JSON.parse(value);

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
              console.error(error.message);
            }
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

export default GraphQLInputsForm;
