import React, { FC } from 'react';
import { GraphQLInputParams } from '../../helpers/types';
import { Box, FormControl, FormLabel, Input, Select, useTheme } from '@chakra-ui/react';
import AceEditor from 'react-ace';
// import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-graphqlschema';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  params: GraphQLInputParams;
  onChange: (params: GraphQLInputParams) => void;
};

const GraphQLInputsForm: FC<Props> = ({ params, onChange }) => {
  const { contentType, method, uri, body, timeout, headers } = params.http_request;
  const { query, variables } = body;
  const theme = useTheme();

  return (
    <>
      <FormControl id="uri" my={6}>
        <FormLabel>URI</FormLabel>
        <Input
          variant="filled"
          name="uri"
          value={uri}
          onChange={(event) => {
            event.persist();
            onChange({
              ...params,
              http_request: {
                ...params.http_request,
                uri: event.target.value,
              },
            });
          }}
        />
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
              http_request: {
                ...params.http_request,
                contentType: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="timeout" my={6}>
        <Box w={1 / 2}>
          <FormLabel>Timeout</FormLabel>
          <Input
            variant="filled"
            name="timeout"
            value={timeout}
            onChange={(event) => {
              event.persist();
              onChange({
                ...params,
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
        <AceEditor
          mode="json"
          name="headers"
          theme="textmate"
          wrapEnabled
          value={JSON.stringify(headers, null, 2)}
          onChange={(value) => {
            onChange({
              ...params,
              http_request: {
                ...params.http_request,
                headers: JSON.parse(value),
              },
            });
          }}
          enableBasicAutocompletion
          tabSize={2}
          fontSize={16}
          width="100%"
          height="100px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
      <FormControl id="query" my={6}>
        <FormLabel>GraphQL query</FormLabel>
        <AceEditor
          mode="graphql"
          name="query"
          theme="textmate"
          wrapEnabled
          value={query}
          onChange={(value) => {
            onChange({
              ...params,
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
          tabSize={2}
          fontSize={16}
          width="100%"
          height="200px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
      <FormControl id="variables">
        <FormLabel>Variables</FormLabel>
        <AceEditor
          mode="json"
          name="variables"
          theme="textmate"
          wrapEnabled
          value={JSON.stringify(variables, null, 2)}
          onChange={(value) => {
            onChange({
              ...params,
              http_request: {
                ...params.http_request,
                body: {
                  ...params.http_request.body,
                  variables: JSON.parse(value),
                },
              },
            });
          }}
          enableBasicAutocompletion
          tabSize={2}
          fontSize={16}
          width="100%"
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
