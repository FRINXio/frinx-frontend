import { HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import ActionItem from './action-item';

const UniflowActions: FC = () => {
  return (
    <HStack spacing={4} alignItems="stretch">
      <ActionItem
        icon="layers"
        to="/workflow-manager/definitions"
        title="Explore workflows"
        text="Browse executed workflows."
        buttonText="Exlore"
        // variant="blue"
      />
      <ActionItem
        icon="check-circle"
        to="/workflow-manager/executed"
        title="Executed workflows"
        text="Browse executed workflows."
        buttonText="Browse"
      />
      <ActionItem
        icon="plus-circle"
        to="/workflow-manager/builder"
        title="Create workflow"
        text="Create a workflow by using a workflow builder.."
        buttonText="Create"
      />
    </HStack>
  );
};

export default UniflowActions;
