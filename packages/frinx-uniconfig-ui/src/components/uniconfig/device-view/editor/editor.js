import React, { useEffect, useRef } from 'react';
import { Stack, Text, Badge, Box } from '@chakra-ui/react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
require('codemirror/mode/javascript/javascript');

const Editor = ({ isReadOnly, isModified, isParsable, currentState, setCurrentLocalConfigState }) => {
  const codemirrorRef = useRef();

  useEffect(() => {
    // workaround to deal with CodeMirror css import order and overwriting
    codemirrorRef.current.editor.display.wrapper.style.height = '500px';
  }, []);

  return (
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

      <CodeMirror
        value={currentState}
        ref={codemirrorRef}
        onBeforeChange={(editor, data, value) => setCurrentLocalConfigState(value)}
        options={{
          mode: 'application/ld+json',
          lineNumbers: true,
          lineWrapping: true,
          readOnly: isReadOnly,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        }}
      />
    </>
  );
};

export default Editor;
