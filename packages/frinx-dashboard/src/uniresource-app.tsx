import React, { FC, useEffect, useState } from 'react';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/uniresource-ui').then((mod) => {
      const {
        PoolsList,
        StrategiesList,
        ResourceTypesList,
        UniresourceAppProvider,
        CreateNestedPool,
        CreateNewStrategy
      } = mod;
      setComponents({
        PoolsList,
        StrategiesList,
        ResourceTypesList,
        UniresourceAppProvider,
        CreateNestedPool,
        CreateNewStrategy
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    PoolsList,
    StrategiesList,
    ResourceTypesList,
    UniresourceAppProvider,
    CreateNestedPool,
    CreateNewStrategy
  } = components;

  return (
      <UniresourceAppProvider>
        <Switch>
          <Route exact path="/uniresource">
            <Redirect to="/uniresource/pools" />
          </Route>
          <Route exact path="/uniresource/pools/new">
            <CreateNestedPool />
          </Route>
          <Route exact path="/uniresource/pools">
            <PoolsList />
          </Route>
          <Route exact path="/uniresource/strategies/new">
            <CreateNewStrategy onSaveButtonClick={() => {
              history.push('/uniresource/strategies');
            }} />
          </Route>
          <Route exact path="/uniresource/strategies">
            <StrategiesList onAddButtonClick={() => {
              history.push('/uniresource/strategies/new');
            }} />
          </Route>
          <Route exact path="/uniresource/resourceTypes">
            <ResourceTypesList />
          </Route>
        </Switch>
      </UniresourceAppProvider>
);
};

export default UniresourceApp;
