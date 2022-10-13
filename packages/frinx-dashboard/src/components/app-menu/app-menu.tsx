import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { FC } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ServiceKey } from '../../types';
import AppMenuItem from './app-menu-item';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
};

const AppMenu: FC<Props> = ({ enabledServices }) => {
  return (
    <Flex alignItems="stretch" height="100%">
      <Routes>
        {enabledServices.get('isUniflowEnabled') && (
          <Route
            path="/workflow-manager/*"
            element={
              <>
                <AppMenuItem to="/workflow-manager/definitions">Definitions</AppMenuItem>
                <AppMenuItem to="/workflow-manager/executed">Executed</AppMenuItem>
                <AppMenuItem to="/workflow-manager/scheduled">Scheduled</AppMenuItem>
                <AppMenuItem to="/workflow-manager/event-listeners">Event listeners</AppMenuItem>
                <AppMenuItem to="/workflow-manager/tasks">Tasks</AppMenuItem>
                <AppMenuItem to="/workflow-manager/poll-data">Poll data</AppMenuItem>
              </>
            }
          />
        )}
        {enabledServices.get('isUniresourceEnabled') && (
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
        )}
        {enabledServices.get('isInventoryEnabled') && (
          <Route
            path="/inventory/*"
            element={
              <>
                <AppMenuItem to="/inventory/devices">Devices</AppMenuItem>
                <AppMenuItem to="/inventory/blueprints">Blueprints</AppMenuItem>
                <AppMenuItem to="/inventory/transactions">Transactions</AppMenuItem>
              </>
            }
          />
        )}
      </Routes>
    </Flex>
  );
};

export default AppMenu;
