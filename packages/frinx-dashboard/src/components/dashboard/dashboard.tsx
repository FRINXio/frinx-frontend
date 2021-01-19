import React, { FC } from 'react';
import { Container, Wrap } from '@chakra-ui/react';
import { faCogs, faLaptopCode, faBoxOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import Panel from '../panel/panel';

function isURLDisabled(envValue: string | undefined) {
  return envValue !== 'true';
}

const PANELS = [
  {
    title: 'UniConfig',
    description: 'Manage network device configurations.',
    url: window.__CONFIG__.url_uniconfig,
    isExternal: false,
    icon: faLaptopCode,
    isDisabled: isURLDisabled(window.__CONFIG__.uniconfig_enabled),
  },
  {
    title: 'UniFlow',
    description: 'Create, organize and execute workflows.',
    url: window.__CONFIG__.url_uniflow,
    isExternal: false,
    icon: faCogs,
    isDisabled: isURLDisabled(window.__CONFIG__.uniflow_enabled),
  },
  {
    title: 'Inventory & Logs',
    description: 'Manage network device configurations.',
    url: window.__CONFIG__.url_inventory,
    isExternal: false,
    icon: faBoxOpen,
    isDisabled: isURLDisabled(window.__CONFIG__.inventory_enabled),
  },
  {
    title: 'User Management',
    description: 'Manage users and permissions.',
    url: window.__CONFIG__.url_usermanagement,
    isExternal: true,
    icon: faUsers,
    isDisabled: isURLDisabled(window.__CONFIG__.usermanagement_enabled),
  },
];

const Dashboard: FC = () => {
  return (
    <Container maxWidth={1280} paddingTop={10}>
      <Wrap spacing={4}>
        {PANELS.map(p => {
          return (
            <Panel
              key={p.title}
              title={p.title}
              description={p.description}
              icon={p.icon}
              style={{ background: 'linear-gradient' }}
              url={p.url}
              isExternal={p.isExternal}
              isDisabled={p.isDisabled}
            />
          );
        })}
      </Wrap>
    </Container>
  );
};

export default Dashboard;
