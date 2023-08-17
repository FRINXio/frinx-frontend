import { Task } from '@frinx/shared';

export type Workflow = {
  id: string;
  name: string;
  description: string | null;
  version: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  tasks: Task[];
  hasSchedule: boolean;
  labels: string[];
  inputParameters: string[] | null;
};
