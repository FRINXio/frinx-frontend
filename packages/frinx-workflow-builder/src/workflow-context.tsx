import React, { createContext, FC, useContext, useState } from 'react';
import merge from 'lodash/merge';
import { v4 as uuid } from 'uuid';
import { InputParameters, Task, TaskWithId, Workflow } from './helpers/types';
import unwrap from './helpers/unwrap';

type BaseTask = Pick<Task, 'taskReferenceName' | 'optional' | 'startDelay'>;

type TaskContextType = {
  workflow: Workflow;
  task: Task | null;
  setTask: (task: Task | null) => void;
  updateTask: (task: RecursivePartial<BaseTask>) => void;
  updateInputParams: (inputParams: RecursivePartial<InputParameters>) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

type Props = {
  workflow: Workflow;
};

function convertWorkflow(wf: Workflow): Workflow<TaskWithId> {
  const { tasks, ...rest } = wf;
  return {
    ...rest,
    tasks: tasks.map((t) => ({
      ...t,
      id: uuid(),
    })),
  };
}

export const TaskProvider: FC<Props> = ({ children, workflow }) => {
  const [workflowState] = useState<Workflow<TaskWithId>>(convertWorkflow(workflow));
  const [taskState, setTaskState] = useState<Task | null>(null);

  const handleTaskUpdate = (baseTask: RecursivePartial<BaseTask>) => {
    setTaskState((s) => {
      const newState = merge(s, baseTask);
      return newState;
    });
  };

  const handleInputParamsUpdate = (inputParams: RecursivePartial<InputParameters>) => {
    setTaskState((s) => {
      const oldState = unwrap(s);
      const { inputParameters } = oldState;
      const newInputParameters = merge(inputParameters, inputParams);
      return {
        ...oldState,
        inputParameters: newInputParameters,
      };
    });
  };

  const setTask = (task: Task | null) => {
    setTaskState(task);
  };

  return (
    <TaskContext.Provider
      value={{
        workflow: workflowState,
        task: taskState,
        setTask,
        updateTask: handleTaskUpdate,
        updateInputParams: handleInputParamsUpdate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useWorkflowContext(): TaskContextType {
  const context = useContext(TaskContext);

  if (context == null) {
    throw new Error('TaskContext error');
  }

  return context;
}

export default TaskContext;
