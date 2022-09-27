import React, { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Select } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { Editor } from '@frinx/shared/src';
import {
  AllocationStrategyLang,
  CreateAllocationStrategyPayload,
  MutationCreateAllocationStrategyArgs,
} from '../__generated__/graphql';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

const query = gql`
  mutation AddStrategyMutation($input: CreateAllocationStrategyInput!) {
    CreateAllocationStrategy(input: $input) {
      strategy {
        id
        Name
        Lang
        Script
      }
    }
  }
`;

type Props = {
  onSaveButtonClick: () => void;
};

const CreateNewStrategy: FC<Props> = ({ onSaveButtonClick }) => {
  const [{ data }, addStrategy] = useMutation<CreateAllocationStrategyPayload, MutationCreateAllocationStrategyArgs>(
    query,
  );
  const [name, setName] = useState('');
  const [lang, setLang] = useState<AllocationStrategyLang>('js');

  const [script, setScript] = useState(
    'function invoke() {\n' +
      '        log(JSON.stringify({respool: resourcePool.ResourcePoolName, currentRes: currentResources}));\n' +
      '        return {vlan: userInput.desiredVlan};\n' +
      '    }\n' +
      '\n',
  );

  const sendMutation = async () => {
    const variables = {
      input: {
        name,
        lang,
        script,
      },
    };
    // TODO validation
    await addStrategy(variables);
    if (data) onSaveButtonClick();
  };
  return (
    <div>
      <Container maxWidth={1200} padding={0}>
        <Box background="white" paddingY={8} paddingX={4}>
          <Heading as="h1" size="lg">
            Create new Strategy
          </Heading>
          <form>
            <FormControl my={6}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                placeholder="Enter name"
              />
            </FormControl>
            <FormControl>
              <Select
                value={lang}
                placeholder="Select option"
                backgroundColor="white"
                w="120px"
                // TODO proper casting
                onChange={(event) => setLang(event.target.value as AllocationStrategyLang)}
              >
                <option key="js_createnewstrategy" value="js">
                  Javascript
                </option>
                <option key="py_createnewstrategy" value="py">
                  Python
                </option>
              </Select>
            </FormControl>
            <FormControl my={6}>
              <Editor
                height="450px"
                width="100%"
                mode={lang === 'js' ? 'javascript' : 'python'}
                theme="tomorrow"
                editorProps={{ $blockScrolling: true }}
                value={script}
                fontSize={16}
                onChange={setScript}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </FormControl>
          </form>
          <Button colorScheme="blue" onClick={() => sendMutation()}>
            Create Nested Pool
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default CreateNewStrategy;
