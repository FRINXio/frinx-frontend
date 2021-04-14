import React, { FC, useEffect, useState } from 'react';
import {Redirect, Route, Switch} from "react-router-dom";

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);

  useEffect(() => {
    import('@frinx/uniresource-ui').then((mod) => {
      const {
        PoolsList,
        StrategiesList,
        ResourceTypesList,
        UniresourceAppProvider
      } = mod;
      setComponents({
        PoolsList,
        StrategiesList,
        ResourceTypesList,
        UniresourceAppProvider
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
    UniresourceAppProvider
  } = components;

  return (
      <UniresourceAppProvider>
        <Switch>
          <Route exact path="/uniresource">
            <Redirect to="/uniresource/pools" />
          </Route>
          <Route exact path="/uniresource/pools">
            <PoolsList />
          </Route>
          <Route exact path="/uniresource/strategies">
            <StrategiesList />
          </Route>
          <Route exact path="/uniresource/resourceTypes">
            <ResourceTypesList />
          </Route>
        </Switch>
      </UniresourceAppProvider>
);
};

export default UniresourceApp;
