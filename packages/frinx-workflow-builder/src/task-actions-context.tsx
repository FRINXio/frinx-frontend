import React, { createContext, FC, useContext, useEffect, useState, useMemo } from 'react';
import { unwrap } from '@frinx/shared/src';
import { ExtendedSubworkflowTask, ExtendedTask } from './helpers/types';

export type SelectedTask =
  | {
      task: ExtendedTask;
      actionType: 'edit';
    }
  | { task: ExtendedSubworkflowTask; actionType: 'expand' };
export type TaskActionsContextType = {
  selectedTask: SelectedTask | null;
  selectTask: (task: SelectedTask | null) => void;
  removedTaskId: string | null;
  setRemovedTaskId: (id: string | null) => void;
};

const TaskActionsContext = createContext<TaskActionsContextType | null>(null);

export const TaskActionsProvider: FC = ({ children }) => {
  const [task, setTask] = useState<SelectedTask | null>(null);
  const [removedTaskId, setRemovedTaskId] = useState<string | null>(null);

  const handleTaskSelect = (selectedTask: SelectedTask | null) => {
    setTask(selectedTask);
  };

  const handleTaskRemove = (id: string | null) => {
    setRemovedTaskId(id);
  };

  const taskActionsContextValue = useMemo(
    () => ({
      selectedTask: task,
      selectTask: handleTaskSelect,
      removedTaskId,
      setRemovedTaskId: handleTaskRemove,
    }),
    [removedTaskId, task],
  );

  return <TaskActionsContext.Provider value={taskActionsContextValue}>{children}</TaskActionsContext.Provider>;
};

export function useTaskActions(removeNode: ((id: string) => void) | void): TaskActionsContextType {
  const { selectedTask, selectTask, removedTaskId, setRemovedTaskId } = unwrap(useContext(TaskActionsContext));

  useEffect(() => {
    if (removedTaskId != null) {
      if (removeNode) {
        removeNode(removedTaskId);
        setRemovedTaskId(null);
      }
    }
  }, [removedTaskId, removeNode, setRemovedTaskId]);

  return { selectedTask, selectTask, removedTaskId, setRemovedTaskId };
}

export default TaskActionsContext;
