import { Box } from '@chakra-ui/react';
import { WorkflowBuilder } from '@frinx/workflow-builder/src';
import React, { useState, VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ExecutedWorkflowDetail from './pages/executed-workflow-detail/executed-workflow-detail';
import EventListeners from './pages/workflow-list/EventListeners/event-listeners';
import ExecutedWorkflowList from './pages/workflow-list/executed-workflow-list/executed-workflow-list';
import PollData from './pages/workflow-list/PollData/poll-data';
import ScheduledWorkflowList from './pages/workflow-list/scheduled-workflow/scheduled-workflow-list';
import TaskList from './pages/workflow-list/Tasks/task-list';
import WorkflowListHeader from './pages/workflow-list/workflow-list-header';
import WorkflowDefinitions from './pages/workflow-list/WorkflowDefs/workflow-definitions';

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
      <Route path="executed" element={<ExecutedWorkflowList onWorkflowIdClick={handleExecutedWfIdClick} />} />
      <Route
        path="executed/:workflowId"
        element={
          <ExecutedWorkflowDetail
            onWorkflowIdClick={handleExecutedWfIdClick}
            onExecutedOperation={handleExecutedWfIdClick}
          />
        }
      />
      <Route path="scheduled" element={<ScheduledWorkflowList />} />
      <Route path="event-listeners" element={<EventListeners />} />
      <Route path="tasks" element={<TaskList />} />
      <Route path="poll-data" element={<PollData />} />
      <Route path="builder">
        <Route
          index
          element={
            <Box marginTop={-10} height="calc(100vh - 64px)">
              <WorkflowBuilder
                onClose={() => {
                  navigate('definitions');
                }}
                onEditWorkflowClick={(name, version) => {
                  navigate(`builder/${name}/${version}`);
                }}
                onNewWorkflowClick={() => {
                  navigate('builder');
                }}
                onExecuteSuccessClick={handleExecutedWfIdClick}
              />
            </Box>
          }
        />
        <Route
          path=":name/:version"
          element={
            <Box marginTop={-10} height="calc(100vh - 64px)">
              <WorkflowBuilder
                onClose={() => {
                  navigate('definitions');
                }}
                onEditWorkflowClick={(name, version) => {
                  navigate(`builder/${name}/${version}`);
                }}
                onNewWorkflowClick={() => {
                  navigate('builder');
                }}
                onExecuteSuccessClick={handleExecutedWfIdClick}
              />
            </Box>
          }
        />
      </Route>
    </Routes>
  );
};

export default Root;
