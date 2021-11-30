import React, { VoidFunctionComponent } from 'react';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';
import unwrap from '../../helpers/unwrap';

type Breadcrumb = {
  text: string;
  link: string;
};

function getBreadcrumbs(path: string): Breadcrumb[] {
  const links = new Map([
    ['sites', { text: 'Sites', link: '/gamma/sites' }],
    ['services', { text: 'Services', link: '/gamma/services' }],
    ['vpn-bearers', { text: 'Bearers', link: '/gamma/vpn-bearers' }],
  ]);

  const [entity] = path.substring('/gamma/'.length).split('/');
  const breadcrumbs = [{ text: 'Control Page', link: '/gamma' }];
  if (entity) {
    breadcrumbs.push(unwrap(links.get(entity)));
  }
  return breadcrumbs;
}

const BreadcrumbComponent: VoidFunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  return (
    <Box m={4}>
      <Breadcrumb>
        {breadcrumbs.map((b) => {
          return (
            <BreadcrumbItem key={`breadcrumb-${b.link}`}>
              <BreadcrumbLink onClick={() => history.push(b.link)}>{b.text}</BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
};

export default BreadcrumbComponent;
