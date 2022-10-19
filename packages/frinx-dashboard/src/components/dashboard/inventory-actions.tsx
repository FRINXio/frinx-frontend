import { HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import ActionItem from './action-item';

const InventoryActions: FC = () => {
  return (
    <HStack spacing={4} mb={8} alignItems="stretch">
      <ActionItem
        to="/inventory"
        title="Explore & configure devices"
        text="Explore and configure devices."
        buttonText="Exlore"
      />
      <ActionItem
        to="/inventory/new"
        title="Add new device"
        text="Connect network device to Device Inventory."
        buttonText="Add device"
      />
    </HStack>
  );
};

export default InventoryActions;
