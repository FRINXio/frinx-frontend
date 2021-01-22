import { IconDefinition, faCogs } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import unwrap from './unwrap';

export type MenuLink = {
  label: string;
  path: string;
};
export type RouteRecord = {
  path: string;
  importFn: () => Promise<{ default: { RootComponent: FC; menuLinks: MenuLink[] } }>;
  label: string;
  description: string;
  icon: IconDefinition;
};
export type RouteType = {
  path: string;
  menuLinks: MenuLink[];
  RootComponent: FC;
};

const importMap = new Map<ServiceName, RouteRecord>([
  [
    'uniflow',
    {
      path: '/uniflow/ui',
<<<<<<< HEAD
      importFn: () => import('@frinx/workflow-ui/src'),
=======
      importFn: () => import('@frinx/workflow-ui/dist'),
>>>>>>> origin/main
      label: 'UniFlow',
      description: 'Create, organize and execute workflows.',
      icon: faCogs,
    },
  ],
]);

export async function getRoutes(): Promise<RouteType[]> {
  return Promise.all(
    // eslint-disable-next-line no-underscore-dangle
    window.__CONFIG__.enabled_services.map(async (r) => {
      const { path, importFn } = unwrap(importMap.get(r));
      const moduleData = await importFn();
      const { menuLinks, RootComponent } = moduleData.default;
      return {
        path,
        menuLinks,
        RootComponent,
      };
    }),
  );
}

export function getDashboardLinks(): Pick<RouteRecord, 'path' | 'label' | 'description' | 'icon'>[] {
  // eslint-disable-next-line no-underscore-dangle
  return window.__CONFIG__.enabled_services.map((serviceName) => {
    const serviceData = unwrap(importMap.get(serviceName));

    return {
      path: serviceData.path,
      label: serviceData.label,
      description: serviceData.description,
      icon: serviceData.icon,
    };
  });
}
