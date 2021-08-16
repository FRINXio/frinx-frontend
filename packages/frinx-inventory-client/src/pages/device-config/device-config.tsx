import { Container, Grid, GridItem, Text, Progress } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import React, { FC } from 'react';
import { useQuery, gql } from 'urql';
import { useParams } from 'react-router-dom';
import { DataStore } from '../../__generated__/graphql';

const QUERY_DATA_STORE = gql`
  query queryDataStore($deviceId: String!) {
    dataStore(deviceId: $deviceId) {
      config
      operational
    }
  }
`;

const DeviceConfig: FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [{ data, fetching, error }] = useQuery<DataStore>({
    query: QUERY_DATA_STORE,
    variables: { deviceId },
  });

  if (fetching) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (error || !data || !data.dataStore.config || !data.dataStore.operational) {
    return null;
  }

  return (
    <Container maxWidth={1280}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem w="100%">
          <Text>Config data store</Text>
          <AceEditor
            width="100%"
            mode="json"
            value={JSON.stringify(JSON.parse(data.dataStore.config), null, 2)}
            theme="tomorrow"
            readOnly
          />
        </GridItem>
        <GridItem w="100%">
          <Text>Operational data store</Text>
          <AceEditor
            width="100%"
            mode="json"
            value={JSON.stringify(JSON.parse(data.dataStore.operational), null, 2)}
            theme="tomorrow"
            readOnly
          />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DeviceConfig;
