import React from 'react';
import { Heading, Button, Flex, Stack, Skeleton } from '@chakra-ui/react';
import Editor from './editor';
import ReactDiffViewer from 'react-diff-viewer';

const Oper = ({ isLoading, showDiff, currentOperState, currentConfigState, syncFromNetwork }) => (
  <>
    <Flex justify="space-between" align="center" marginBottom={4}>
      <Heading as="h4" size="md">
        Actual Configuration
      </Heading>
      <Stack direction="row" spacing={2}>
        <Button isLoading={isLoading} onClick={syncFromNetwork}>
          Sync from network
        </Button>
      </Stack>
    </Flex>
    {!isLoading ? (
      showDiff ? (
        <ReactDiffViewer
          oldValue={JSON.stringify(currentOperState, null, 2)}
          newValue={JSON.stringify(currentConfigState, null, 2)}
          splitView={false}
        />
      ) : (
        <Editor readOnly={true} currentState={JSON.stringify(currentOperState, null, 2)} />
      )
    ) : (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )}
  </>
);

export default Oper;
