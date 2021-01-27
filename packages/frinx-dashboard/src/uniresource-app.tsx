import React, { FC } from 'react';
import { Route, Switch, Redirect, useHistory, useRouteMatch } from 'react-router-dom';

import ResourceManagerStateWrapper from '../../frinx-uniresource-ui/src/ResourceManagerStateWrapper'
import {Pools, ResourceTypes, AllocationStrategies, PoolDetailPage, ResourceList} from "../../frinx-uniresource-ui/src";
import {SnackbarProvider} from "notistack";

// import ResourceTypes from "../../frinx-uniresource-ui/src/resourceTypes/ResourceTypes";

const UniresourceApp: FC = () => {
  const history = useHistory();
  const { params } = useRouteMatch();
  console.log(params);

  return (
      <>
      <ResourceManagerStateWrapper>
          <SnackbarProvider>
        <Switch>
          <Route exact path="/uniresource">
asd

          </Route>
            <Route
                exact
                path="/uniresource/pools/:id"
                render={(props) => {
                    const { match } = props;
                    return (
                        <PoolDetailPage />
                    );
                }}
            />
            <Route
                exact
                path="/uniresource/pools"
                render={(props) => {
                    const { match } = props;
                    return (
                        <Pools />
                    );
                }}
            />
            <Route
                exact
                path="/uniresource/strategies"
                render={(props) => {
                    const { match } = props;
                    return (
                        <AllocationStrategies />
                    );
                }}
            />
            <Route
                exact
                path="/uniresource/resourceTypes"
                render={(props) => {
                    const { match } = props;
                    return (
                        <ResourceTypes />
                    );
                }}
            />

            <Route
                exact
                path="/uniresource/resourceTypes"
                render={(props) => {
                    const { match } = props;
                    return (
                        <ResourceTypes />
                    );
                }}
            />

        </Switch>
          </SnackbarProvider>
      </ResourceManagerStateWrapper>
      </>

  );
};

export default UniresourceApp;
