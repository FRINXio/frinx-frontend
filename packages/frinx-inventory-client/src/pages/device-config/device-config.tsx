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

const QUERY_DATA_STORE = gql`
  query queryDataStore($deviceId: String!) {
    dataStore(deviceId: $deviceId) {
      config
      operational
    }
  }
`;

const UPDATE_DATA_STORE = gql`
  mutation updateDataStore($deviceId: String!, $config: UpdateDataStoreInput!) {
    updateDataStore(deviceId: $deviceId, input: $config) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const COMMIT_DATA_STORE = gql`
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
  const [{ data, fetching, error }] = useQuery<QueryDataStoreQuery, QueryDataStoreQueryVariables>({
    query: QUERY_DATA_STORE,
    variables: { deviceId },
  });
  const [, updateDataStore] = useMutation<UpdateDataStoreMutation, UpdateDataStoreMutationVariables>(UPDATE_DATA_STORE);
  const [, commitConfig] = useMutation<CommitDataStoreConfigMutation, CommitDataStoreConfigMutationVariables>(
    COMMIT_DATA_STORE,
  );

  const [config, setConfig] = useState<string>();
  const [operational, setOperational] = useState<string>();
  const toast = useToast();

  const handleOnSaveConfig = async () => {
    const { data: responseData, error: responseError } = await updateDataStore({
      deviceId,
      config: { config: JSON.stringify(config) },
    });

    if (responseError != null && responseData != null) {
      setConfig(responseData.updateDataStore.dataStore.config);
      setOperational(responseData.updateDataStore.dataStore.operational);

      toast({
        title: 'Successfully updated config data store',
        isClosable: true,
        duration: 2000,
        status: 'success',
      });
    } else {
      toast({
        title: 'Failed to update config data store',
        isClosable: true,
        duration: 2000,
        status: 'error',
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

  useEffect(() => {
    if (data) {
      setConfig(JSON.stringify(JSON.parse(data.dataStore.config), null, 2));
      setOperational(JSON.stringify(JSON.parse(data.dataStore.operational), null, 2));
    }
  }, [data]);

  if (fetching) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (error || data == null) {
    return null;
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
            onChange={(val: string) => setConfig(val)}
          />
        </GridItem>
        <GridItem w="100%">
          <Box my={4}>
            <Text>Operational data store</Text>
          </Box>
          <AceEditor width="100%" mode="json" value={operational} theme="tomorrow" readOnly />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DeviceConfig;
