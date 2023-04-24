import { Box } from '@chakra-ui/react';
import { WorkflowBuilder } from '@frinx/workflow-builder/src';
import React, { useState, VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ExecutedWorkflowDetail from './pages/executed-workflow-detail/executed-workflow-detail';
import EventListeners from './pages/workflow-list/event-listeners/event-listeners';
import ExecutedWorkflowList from './pages/workflow-list/executed-workflow-list/executed-workflow-list';
import PollData from './pages/workflow-list/poll-data/poll-data';
import ScheduledWorkflowList from './pages/workflow-list/scheduled-workflow/scheduled-workflow-list';
import TaskList from './pages/workflow-list/tasks/task-list';
import WorkflowListHeader from './pages/workflow-list/workflow-list-header';
import WorkflowDefinitions from './pages/workflow-list/workflow-definitions/workflow-definitions';

const Root: VoidFunctionComponent = () => {
  const [key, setKey] = useState(uuid());
  const navigate = useNavigate();

  const handleExecutedWfIdClick = (id: string) => {
    navigate(`executed/${id}`);
  };

  return (
    <Routes>
      <Route index element={<Navigate replace to="definitions" />} />
      <Route
        path="definitions"
        element={
          <>
            <WorkflowListHeader
              onImportSuccess={() => {
                setKey(uuid());
              }}
            />
            <WorkflowDefinitions key={key} />
          </>
        }
      />
      <Route path="executed" element={<ExecutedWorkflowList key={key} />} />
      <Route
        path="executed/:workflowId"
        element={<ExecutedWorkflowDetail onExecutedOperation={handleExecutedWfIdClick} />}
      />
      <Route path="scheduled" element={<ScheduledWorkflowList />} />
      <Route path="event-listeners" element={<EventListeners />} />
      <Route path="tasks" element={<TaskList />} />
      <Route path="poll-data" element={<PollData />} />
      <Route path="builder">
        <Route
          index
          element={
            <Box marginTop={-10}>
              <WorkflowBuilder
                onClose={() => {
                  navigate('definitions');
                }}
              />
            </Box>
          }
        />
        <Route
          path=":workflowId"
          element={
            <Box marginTop={-10}>
              <WorkflowBuilder
                onClose={() => {
                  navigate('definitions');
                }}
              />
            </Box>
          }
        />
      </Route>
    </Routes>
  );
};

export default Root;
