import React, { FC } from 'react';
import { Container, Wrap } from '@chakra-ui/react';
import { faCogs, faLaptopCode, faBoxOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import Panel from '../panel/panel';
import { getDashboardLinks } from '../../helpers/route.helpers';

const PANELS = getDashboardLinks();

const Dashboard: FC = () => {
  return (
    <Container maxWidth={1280}>
      <Wrap spacing={4}>
        {PANELS.map((p) => {
          return <Panel key={p.label} label={p.label} description={p.description} icon={p.icon} path={p.path} />;
        })}
      </Wrap>
    </Container>
  );
};

export default Dashboard;
