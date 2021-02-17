import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory, RouteComponentProps } from 'react-router-dom';

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/uniresource-ui').then((mod) => {
      const {
        ResourceTypes,
        Pools,
        ResourceList,
        PoolDetailPage,
        AllocationStrategies,
        ResourceManagerStateWrapper,
      } = mod;
      setComponents({
        ResourceTypes,
        Pools,
        ResourceList,
        PoolDetailPage,
        AllocationStrategies,
        ResourceManagerStateWrapper,
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    ResourceTypes,
    Pools,
    ResourceList,
    PoolDetailPage,
    AllocationStrategies,
    ResourceManagerStateWrapper,
  } = components;

  return (
    <ResourceManagerStateWrapper>
      <Switch>
        <Route exact path="/uniresource">
          <Redirect to="/uniresource/pools" />
        </Route>
        <Route
          exact
          path="/uniresource/pools/:id"
          render={(props: RouteComponentProps<{ id: string }>) => {
            const { id } = props.match.params;
            return (
              <PoolDetailPage
                id={id}
                onBreadcrumbLinkClick={(routeId: string) => {
                  history.push(`/uniresource/pools/${routeId}`);
                }}
              />
            );
          }}
        />
        <Route exact path="/uniresource/pools">
          <Pools
            onDetailClick={(id: string) => {
              history.push(`/uniresource/pools/${id}`);
            }}
          />
        </Route>
        <Route exact path="/uniresource/strategies">
          <AllocationStrategies />
        </Route>
        <Route exact path="/uniresource/resourceTypes">
          <ResourceTypes />
        </Route>
        <Route
          exact
          path="/uniresource/resources/:id"
          render={(props: RouteComponentProps<{ id: string }>) => {
            const { id } = props.match.params;
            return <ResourceList id={id} />;
          }}
        />
      </Switch>
    </ResourceManagerStateWrapper>
  );
};

export default UniresourceApp;
