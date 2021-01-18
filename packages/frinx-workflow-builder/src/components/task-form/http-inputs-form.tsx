import React, { FC } from 'react';
import { HTTPInputParams, HTTPMethod } from 'helpers/types';
import { Box, FormControl, FormLabel, Input, Select, useTheme } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import unwrap from '../../helpers/unwrap';

type Props = {
  params: HTTPInputParams;
  onChange: (p: RecursivePartial<HTTPInputParams>) => void;
};

function getBodyFromRequest(params: HTTPInputParams): string | null {
  if (params.http_request.method !== 'GET') {
    return params.http_request.body;
  }
  return null;
}

const HTTPInputsForm: FC<Props> = ({ params, onChange }) => {
  const { contentType, method, uri, timeout, headers } = params.http_request;
  const body = getBodyFromRequest(params);
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
              http_request: {
                uri: event.target.value,
              },
            });
          }}
        />
      </FormControl>
      <FormControl id="method" my={6}>
        <FormLabel>Method</FormLabel>
        <Select
          variant="filled"
          name="method"
          value={method}
          onChange={(event) => {
            event.persist();
            onChange({
              http_request: {
                // we can safely cast this
                method: event.target.value as HTTPMethod,
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
              http_request: {
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
                http_request: {
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
              http_request: {
                headers: JSON.parse(value),
              },
            });
          }}
          enableBasicAutocompletion
          tabSize={2}
          fontSize={16}
          height="100px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
      {method !== 'GET' && (
        <FormControl id="body" my={6}>
          <FormLabel>Body</FormLabel>
          <AceEditor
            mode="json"
            name="body"
            theme="textmate"
            wrapEnabled
            value={body ?? ''}
            onChange={(value) => {
              onChange({
                http_request: {
                  body: value,
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
      )}
    </>
  );
};

export default HTTPInputsForm;
