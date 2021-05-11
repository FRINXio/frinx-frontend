import React from 'react';
import { Stack, Text, Badge, Box } from '@chakra-ui/react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';

const Editor = ({ isReadOnly, isModified, isParsable, currentState, setCurrentLocalConfigState }) => (
  <>
    <Box bg="#EDF2F7" w="100%" h="30px" p={4}>
      <Stack h="100%" isInline={true} align="center">
        <Text fontSize="md">{isReadOnly ? 'Operational datastore' : 'Configurational datastore'}</Text>
        {isModified && (
          <Badge variant="outline" colorScheme="yellow">
            Modified
          </Badge>
        )}
        {isParsable === false && <Badge colorScheme="red">Could not parse JSON. Check syntax.</Badge>}
      </Stack>
    </Box>
    <AceEditor
      mode="json"
      theme="textmate"
      value={currentState}
      onChange={setCurrentLocalConfigState}
      name="uniconfig_editor"
      width="100%"
      fontSize={16}
      wrapEnabled={true}
      readOnly={isReadOnly}
    />
  </>
);

export default Editor;
