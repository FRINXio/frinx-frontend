import React, {FC, useEffect, useState} from 'react';
import { Route, Switch, Redirect, useHistory, useRouteMatch } from 'react-router-dom';

// import ResourceManagerStateWrapper from '../../frinx-uniresource-ui/src/ResourceManagerStateWrapper'
// import {Pools, ResourceTypes, AllocationStrategies, PoolDetailPage, ResourceList} from "../../frinx-uniresource-ui/src";
// import {SnackbarProvider} from "notistack";

// import {
//     SnackbarProvider,
//     ResourceTypes,
//     Pools,
//     ResourceList,
//     PoolDetailPage,
//     ThemeProvider,
//     AllocationStrategies,
//     ResourceManagerStateWrapper
// } from '@frinx/uniresource-ui';

const UniresourceApp: FC = () => {
  const { params } = useRouteMatch();
  console.log(params);
    const [components, setComponents] = useState<typeof import('@frinx/uniresource-ui') | null>(null);
    const history = useHistory();

    useEffect(() => {
        import('@frinx/uniresource-ui').then((mod) => {
            const {
                SnackbarProvider,
                ResourceTypes,
                Pools,
                ResourceList,
                PoolDetailPage,
                ThemeProvider,
                AllocationStrategies,
                ResourceManagerStateWrapper,
            } = mod;
            setComponents({
                SnackbarProvider,
                ResourceTypes,
                Pools,
                ResourceList,
                PoolDetailPage,
                ThemeProvider,
                AllocationStrategies,
                ResourceManagerStateWrapper
            });
        });
    }, []);

    if (components == null) {
        return null;
    }

    const {
            SnackbarProvider,
        ResourceTypes,
        Pools,
        ResourceList,
        PoolDetailPage,
        ThemeProvider,
        AllocationStrategies,
        ResourceManagerStateWrapper
    } = components;

  return (
      <ResourceManagerStateWrapper>
          <SnackbarProvider>
              <ThemeProvider>
                <Switch>
                  <Route exact path="/uniresource">
                      <Pools />
                  </Route>
                    <Route
                        exact
                        path="/uniresource/pools/:id"
                        render={(props) => {
                            const { match } = props;
                            console.log(match)
                            // @ts-ignore
                            return (
                                <PoolDetailPage
                                    match={match}
                                    onBreadcrumbLinkClicked={(id: string) => {
                                        history.push(`/uniresource/pools/${id}`);
                                    }}
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/uniresource/pools"
                        render={(props) => {
                            const { match } = props;
                            return (
                                <Pools
                                    onDetailClicked={(id: string) => {
                                        history.push(`/uniresource/pools/${id}`);
                                    }}
                                />
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
                        path="/uniresource/resources/:id"
                        render={(props) => {
                            const { match } = props;
                            return (
                                <ResourceList match={match} />
                            );
                        }}
                    />

                </Switch>
              </ThemeProvider>
          </SnackbarProvider>

      </ResourceManagerStateWrapper>
  );
};

export default UniresourceApp;
