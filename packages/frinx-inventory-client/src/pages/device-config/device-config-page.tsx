import {
  Container,
  Grid,
  GridItem,
  Text,
  Progress,
  Button,
  Box,
  Flex,
  Spacer,
  useToast,
  HStack,
} from '@chakra-ui/react';
import AceEditor from 'react-ace';
import React, { FC, useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from 'urql';
import {
  CommitDataStoreConfigMutation,
  CommitDataStoreConfigMutationVariables,
  QueryDataStoreQuery,
  QueryDataStoreQueryVariables,
  UpdateDataStoreMutation,
  UpdateDataStoreMutationVariables,
} from '../../__generated__/graphql';

const DATA_STORE_QUERY = gql`
  query queryDataStore($deviceId: String!) {
    dataStore(deviceId: $deviceId) {
      config
      operational
    }
  }
`;

const UPDATE_DATA_STORE_MUTATION = gql`
  mutation updateDataStore($deviceId: String!, $input: UpdateDataStoreInput!) {
    updateDataStore(deviceId: $deviceId, input: $input) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const COMMIT_DATA_STORE_MUTATION = gql`
  mutation commitDataStoreConfig($deviceId: String!) {
    commitConfig(deviceId: $deviceId) {
      isOk
    }
  }
`;

type Props = {
  deviceId: string;
};

const DeviceConfig: FC<Props> = ({ deviceId }) => {
  const [{ data, fetching, error }, executeQuery] = useQuery<QueryDataStoreQuery, QueryDataStoreQueryVariables>({
    query: DATA_STORE_QUERY,
    variables: { deviceId },
  });
  const [, updateDataStore] = useMutation<UpdateDataStoreMutation, UpdateDataStoreMutationVariables>(
    UPDATE_DATA_STORE_MUTATION,
  );
  const [, commitConfig] = useMutation<CommitDataStoreConfigMutation, CommitDataStoreConfigMutationVariables>(
    COMMIT_DATA_STORE_MUTATION,
  );
  const [config, setConfig] = useState<string>();
  const toast = useToast();

  useEffect(() => {
    if (data != null && data.dataStore != null) {
      setConfig(JSON.stringify(JSON.parse(data.dataStore.config ?? ''), null, 2));
    }
  }, [data]);

  const handleOnSaveConfig = async () => {
    const { data: responseData, error: responseError } = await updateDataStore({
      deviceId,
      input: { config: JSON.stringify(JSON.parse(config ?? ''), null, 0) },
    });

    if (responseError != null) {
      toast({
        title: 'Failed to update config data store',
        isClosable: true,
        duration: 2000,
        status: 'error',
      });
    }

    if (responseData != null) {
      executeQuery();

      toast({
        title: 'Successfully updated config data store',
        isClosable: true,
        duration: 2000,
        status: 'success',
      });
    }
  };

  const handleOnCommitConfig = async () => {
    const { error: responseError } = await commitConfig({ deviceId });

    if (responseError != null) {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'success',
        title: 'Successfully commited changes',
      });
    } else {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'error',
        title: 'Failed to commit changes',
      });
    }
  };

  if (fetching) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (error != null) {
    return <div>{error.message}</div>;
  }

  return (
    <Container maxWidth={1280}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem w="100%">
          <Flex>
            <Box my={4}>
              <Text>Config data store</Text>
            </Box>
            <Spacer />
            <Box my={2}>
              <HStack>
                <Button colorScheme="blue" onClick={handleOnSaveConfig}>
                  Save
                </Button>
                <Button colorScheme="blue" onClick={handleOnCommitConfig}>
                  Commit
                </Button>
              </HStack>
            </Box>
          </Flex>
          <AceEditor
            width="100%"
            mode="json"
            value={config}
            theme="tomorrow"
            onChange={(val) => {
              setConfig(val);
            }}
          />
        </GridItem>
        <GridItem w="100%">
          <Box my={4}>
            <Text>Operational data store</Text>
          </Box>
          <AceEditor
            width="100%"
            mode="json"
            value={JSON.stringify(JSON.parse(data?.dataStore?.operational ?? ''), null, 2)}
            theme="tomorrow"
            readOnly
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DeviceConfig;
