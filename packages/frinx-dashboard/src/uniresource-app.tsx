import { UniresourceApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';
import { authContext } from './auth-helpers';

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);
  const history = useHistory();

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
    PoolDetailPage,
  } = components;

  return (
    <UniresourceAppProvider
      client={UniresourceApi.create({ url: window.__CONFIG__.uniresourceApiURL, authContext }).client}
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
                onPoolClick={(poolId: string) => history.push(`/uniresource/pools/${poolId}`)}
                onCreateNestedPoolClick={() => {
                  history.push({
                    pathname: '/uniresource/pools/new',
                    search: `?parentPoolId=${props.match.params.poolId}&isNested=true`,
                  });
                }}
              />
            );
          }}
        />
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
