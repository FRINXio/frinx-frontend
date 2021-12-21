import { NestedExecutedWorkflow, ExecutedWorkflow } from '../../../types/types';
import callbackUtils from '../../../utils/callback-utils';

const mapLabelsForApi = (labels: string[]): string => {
  return labels.reduce((prev, curr, currId) => {
    if (currId !== labels.length - 1) {
      return prev.concat(`${curr}&`);
    } else {
      return prev.concat(`${curr}`);
    }
  }, '');
};

export const fetchNewData = (workflowName: string, viewedPage: number, defaultPages: number, labels: string[]) => {
  const page = viewedPage * defaultPages;
  const mappedLabels = mapLabelsForApi(labels);

  const { getWorkflowExecutions } = callbackUtils.getCallbacks;
  return getWorkflowExecutions(workflowName, mappedLabels, page, defaultPages.toString());
};

export const fetchParentWorkflows = (
  workflowName: string,
  viewedPage: number,
  defaultPages: number,
  labels: string[],
) => {
  const mappedLabels = mapLabelsForApi(labels);

  const { getWorkflowExecutionsHierarchical } = callbackUtils.getCallbacks;
  return getWorkflowExecutionsHierarchical(workflowName, mappedLabels, viewedPage, defaultPages.toString());
};

export const isValid = (
  item: NestedExecutedWorkflow | ExecutedWorkflow,
  searchTerm: string,
  labels: string[],
): boolean => {
  if (searchTerm.trim().length === 0 && labels.length === 0) {
    return true;
  }
  return item.workflowType.includes(searchTerm) || labels.includes(item.status);
};

export const getSortValue = (value: number) => {
  if (value || value === 2) {
    return 0;
  }
  return 1;
};

export const getValueOfProperty = (sortValues: number[]): string => {
  const index = sortValues.findIndex((value) => value != 2);

  switch (index) {
    case 0:
      return 'workflowId';
    case 1:
      return 'startTime';
    case 2:
      return 'endTime';
    default:
      return 'startTime';
  }
};

export const getOrderValue = (sortValues: number[]) => {
  switch (getValueOfProperty(sortValues)) {
    case 'workflowId':
      return sortValues[0] ? 'asc' : 'desc';
    case 'startTime':
      return sortValues[1] ? 'asc' : 'desc';
    case 'endTime':
      return sortValues[2] ? 'asc' : 'desc';
    default:
      return 'desc';
  }
};
