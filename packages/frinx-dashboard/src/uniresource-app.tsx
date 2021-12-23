import { UniresourceApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { authContext } from './auth-helpers';

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);
  const history = useHistory();
  const [key, setKey] = useState(uuid());

  useEffect(() => {
    import('@frinx/uniresource-ui').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    PoolsPage,
    CreatePoolPage,
    StrategiesPage,
    ResourceTypesList,
    UniresourceAppProvider,
    CreateStrategyPage,
    CreateAllocatingIpv4PrefixPoolPage,
    CreateAllocatingVlanPoolPage,
    PoolDetailPage,
  } = components;

  return (
    <UniresourceAppProvider
      client={UniresourceApi.create({ url: window.__CONFIG__.uniresource_api_url, authContext }).client}
    >
      <Switch>
        <Route exact path="/uniresource">
          <Redirect to="/uniresource/pools" />
        </Route>
        <Route exact path="/uniresource/pools/new">
          <CreatePoolPage
            onCreateSuccess={() => {
              history.push('/uniresource/pools');
            }}
          />
        </Route>
        <Route exact path="/uniresource/pools">
          <PoolsPage
            onNewPoolBtnClick={() => {
              history.push('/uniresource/pools/new');
            }}
            onNewIpv4PrefixBtnClick={() => {
              history.push('/uniresource/pools/new/allocating/ipv4-prefix');
            }}
            onNewVlanBtnClick={() => {
              history.push('/uniresource/pools/new/allocating/vlan');
            }}
            onPoolNameClick={(poolId: string) => history.push(`/uniresource/pools/${poolId}`)}
          />
        </Route>
        <Route
          exact
          path="/uniresource/pools/:poolId"
          render={(props: RouteComponentProps<{ poolId: string }>) => {
            return (
              <PoolDetailPage
                poolId={props.match.params.poolId}
                reload={() => {
                  setKey(uuid());
                }}
                key={key}
              />
            );
          }}
        />
        <Route exact path="/uniresource/pools/new/allocating/ipv4-prefix">
          <CreateAllocatingIpv4PrefixPoolPage
            onCreateSuccess={() => {
              history.push('/uniresource');
            }}
          />
        </Route>
        <Route exact path="/uniresource/pools/new/allocating/vlan">
          <CreateAllocatingVlanPoolPage
            onCreateSuccess={() => {
              history.push('/uniresource');
            }}
          />
        </Route>
        <Route exact path="/uniresource/strategies/new">
          <CreateStrategyPage
            onSaveButtonClick={() => {
              history.push('/uniresource/strategies');
            }}
          />
        </Route>
        <Route exact path="/uniresource/strategies">
          <StrategiesPage
            onAddButtonClick={() => {
              history.push('/uniresource/strategies/new');
            }}
          />
        </Route>
        <Route exact path="/uniresource/resourceTypes">
          <ResourceTypesList />
        </Route>
      </Switch>
    </UniresourceAppProvider>
  );
};

export default UniresourceApp;
