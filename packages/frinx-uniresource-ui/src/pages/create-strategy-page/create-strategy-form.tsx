import React, { VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input, Select, Spacer } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { Editor } from '@frinx/shared/src';
import { AllocationStrategyLang } from '../../__generated__/graphql';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import ExpectedPoolProperties from './expected-pool-properties-form';

function getDefaultScriptValue(): string {
  return `function invoke() {
  log(JSON.stringify({ respool: resourcePool.ResourcePoolName, currentRes: currentResources }));
  return { vlan: userInput.desiredVlan };
}`;
}

const INITIAL_VALUES: FormValues = {
  name: '',
  lang: 'js',
  script: getDefaultScriptValue(),
  expectedPoolPropertyTypes: [{ key: 'address', type: 'int' }],
};

export type FormValues = {
  name: string;
  lang: AllocationStrategyLang;
  script: string;
  expectedPoolPropertyTypes?: { key: string; type: string }[];
};
type Props = {
  onFormSubmit: (values: FormValues) => void;
};

const CreateStrategyForm: VoidFunctionComponent<Props> = ({ onFormSubmit }) => {
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue } = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: (data) => {
      onFormSubmit(data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl marginY={5} id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input name="name" id="name" value={values.name} onChange={handleChange} placeholder="Enter name" />
      </FormControl>
      <FormControl id="lang" marginY={5}>
        <FormLabel>Strategy script language</FormLabel>
        <Select
          id="lang"
          name="lang"
          value={values.lang}
          onChange={handleChange}
          placeholder="Select script language"
          width={60}
        >
          <option value="js">Javascript</option>
          <option value="py">Python</option>
        </Select>
      </FormControl>
      <ExpectedPoolProperties
        expectedPoolPropertyTypes={values.expectedPoolPropertyTypes}
        onPoolPropertyAdd={(newPoolProperties) => setFieldValue('expectedPoolPropertyTypes', newPoolProperties)}
        onPoolPropertyChange={(newPoolProperties) => setFieldValue('expectedPoolPropertyTypes', newPoolProperties)}
        onPoolPropertyDelete={(newPoolProperties) => setFieldValue('expectedPoolPropertyTypes', newPoolProperties)}
      />
      <FormControl marginY={5}>
        <FormLabel>Strategy script</FormLabel>
        <Editor
          height="450px"
          width="100%"
          mode={values.lang === 'js' ? 'javascript' : 'python'}
          theme="tomorrow"
          editorProps={{ $blockScrolling: true }}
          value={values.script}
          fontSize={16}
          onChange={(value) => {
            setFieldValue('script', value);
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </FormControl>
      <HStack>
        <Spacer />
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create strategy
        </Button>
      </HStack>
    </form>
  );
};

export default CreateStrategyForm;
