import React, { FC } from 'react';
import { Container, Wrap } from '@chakra-ui/react';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import Panel from '../panel/panel';
import { ServiceKey } from '../../types';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const Dashboard: FC<Props> = ({ enabledServices }) => {
  return (
    <Container maxWidth={1280}>
      <Wrap spacing={4}>
        {enabledServices.get('uniflow_enabled') && (
          <Panel label="Uniflow" description="Create, organize and execute workflows." icon={faCogs} path="/uniflow" />
        )}
      </Wrap>
    </Container>
  );
};

export default Dashboard;
