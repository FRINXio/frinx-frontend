export type StartWorkflow = {
  name?: string | null;
  version?: number | null;
  input?: [string, string | number][] | null;
  correlationId?: string | null;
  taskToDomain?: [string, string | number][] | null;
};

export type ActionTask = {
  workflowId?: string | null;
  taskId?: string | null;
  output?: [string, string | number][] | null;
  taskRefName?: string | null;
};
