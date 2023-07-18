import { Box } from '@chakra-ui/react';
import { WorkflowBuilder } from '@frinx/workflow-builder/src';
import React, { useState, VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ExecutedWorkflowDetail from './pages/executed-workflow-detail/executed-workflow-detail';
import ExecutedWorkflowList from './pages/executed-workflow-list/executed-workflow-list';
import PollData from './pages/poll-data/poll-data';
import ScheduledWorkflowList from './pages/scheduled-workflow/scheduled-workflow-list';
import TaskList from './pages/workflow-list/tasks/task-list';
import WorkflowListHeader from './components/workflow-list-header';
import WorkflowDefinitions from './pages/workflow-definitions/workflow-definitions';
import EventHandlersListPage from './pages/event-handlers-list/event-handlers-list-page';
import EventHandlersDetailPage from './pages/event-handlers-detail/event-handlers-detail-page';
import EventHandlerDetailEditPage from './pages/event-handlers-detail-edit/event-handler-detail-edit-page';
import EventHandlersAddPage from './pages/event-handlers-list/event-handlers-add-page';

const Root: VoidFunctionComponent = () => {
  const [key, setKey] = useState(uuid());
  const navigate = useNavigate();

  const handleExecutedWfIdClick = (id: string) => {
    navigate(`executed/${id}`);
  };

  const handleOnEventHandlerDetailClick = (event: string, name: string) => {
    navigate(`event-handlers/${event}/${name}`);
  };

  const handleOnEventHandlerEditClick = (event: string, name: string) => {
    navigate(`event-handlers/${event}/${name}/edit`);
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
      <Route path="event-handlers">
        <Route
          index
          element={
            <EventHandlersListPage
              onEventHandlerDetailClick={handleOnEventHandlerDetailClick}
              onEventHandlerEditClick={handleOnEventHandlerEditClick}
            />
          }
        />
        <Route
          path=":event/:name"
          element={<EventHandlersDetailPage onEventHandlerEditClick={handleOnEventHandlerEditClick} />}
        />
        <Route path=":event/:name/edit" element={<EventHandlerDetailEditPage />} />
        <Route path="add" element={<EventHandlersAddPage />} />
      </Route>
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
          path=":workflowId/:version"
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
