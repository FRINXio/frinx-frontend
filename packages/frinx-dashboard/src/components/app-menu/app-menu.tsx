import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import AppMenuItem from './app-menu-item';

const AppMenu: VoidFunctionComponent = () => {
  return (
    <Flex alignItems="stretch" height="100%">
      <Routes>
        <Route
          path="/workflow-manager/*"
          element={
            <>
              <AppMenuItem to="/workflow-manager/definitions">Definitions</AppMenuItem>
              <AppMenuItem to="/workflow-manager/executed">Executed</AppMenuItem>
              <AppMenuItem to="/workflow-manager/scheduled">Scheduled</AppMenuItem>
              <AppMenuItem to="/workflow-manager/event-handlers">Event handlers</AppMenuItem>
              <AppMenuItem to="/workflow-manager/tasks">Tasks</AppMenuItem>
              <AppMenuItem to="/workflow-manager/poll-data">Poll data</AppMenuItem>
            </>
          }
        />
        <Route
          path="/resource-manager/*"
          element={
            <>
              <Menu>
                <AppMenuItem as={MenuButton}>IPAM</AppMenuItem>
                <MenuList>
                  <MenuItem to="/resource-manager/ipam" as={NavLink}>
                    IPAM
                  </MenuItem>
                  <MenuItem as={NavLink} to="/resource-manager/ipam/aggregates">
                    Aggregates
                  </MenuItem>
                  <MenuItem as={NavLink} to="/resource-manager/ipam/ip-ranges">
                    IP Ranges
                  </MenuItem>
                  {/* <MenuItem>Prefixes</MenuItem> */}
                </MenuList>
              </Menu>

              <AppMenuItem to="/resource-manager/pools">Pools</AppMenuItem>
              <AppMenuItem to="/resource-manager/strategies">Strategies</AppMenuItem>
              <AppMenuItem to="/resource-manager/resource_types">Resource Types</AppMenuItem>
            </>
          }
        />
        <Route
          path="/inventory/*"
          element={
            <>
              <AppMenuItem to="/inventory/devices">Devices</AppMenuItem>
              <AppMenuItem to="/inventory/streams">Streams</AppMenuItem>
              <AppMenuItem to="/inventory/blueprints">Blueprints</AppMenuItem>
              <AppMenuItem to="/inventory/transactions">Transactions</AppMenuItem>
              <AppMenuItem to="/inventory/locations">Locations</AppMenuItem>
              <AppMenuItem to="/inventory/shell">UniConfig Shell</AppMenuItem>
            </>
          }
        />
      </Routes>
    </Flex>
  );
};

export default AppMenu;
