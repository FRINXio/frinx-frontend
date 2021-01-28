import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

const UniconfigApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/uniconfig-ui') | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/uniconfig-ui').then((mod) => {
      const { DeviceView, List } = mod;
      setComponents({ DeviceView, List });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { List, DeviceView } = components;

  return (
    <Switch>
      <Route exact path="/uniconfig">
        <Redirect to="/uniconfig/devices" />
      </Route>
      <Route exact path="/uniconfig/devices">
        <List
          onEditBtnClick={(id: string) => {
            history.push(`/uniconfig/devices/edit/${id}`);
          }}
        />
      </Route>
      <Route exact path="/uniconfig/devices/edit/:id">
        <DeviceView />
      </Route>
    </Switch>
  );
};

export default UniconfigApp;
