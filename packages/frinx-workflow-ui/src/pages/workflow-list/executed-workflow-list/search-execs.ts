import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';

type SortBy = 'workflowId' | 'startTime' | 'endTime';
type SortOrder = 'ASC' | 'DESC';

const getApiLabels = (labels: string[]): string => {
  return labels.join('&');
};

// TODO: should be removed here and in bulk.js
export const fetchNewData = (workflowName: string, viewedPage: number, defaultPages: number, labels: string[]) => {
  const viewedPageStartFromZero = viewedPage - 1;
  const page = viewedPageStartFromZero * defaultPages;
  const mappedLabels = getApiLabels(labels);

  const { getWorkflowExecutions } = callbackUtils.getCallbacks;
  return getWorkflowExecutions(workflowName, mappedLabels, page, defaultPages.toString());
};

// TODO: should be removed here and in bulk.js
export const fetchParentWorkflows = (
  workflowName: string,
  viewedPage: number,
  defaultPages: number,
  labels: string[],
) => {
  const viewedPageStartFromZero = viewedPage - 1;
  const page = viewedPageStartFromZero * defaultPages;
  const mappedLabels = getApiLabels(labels);

  const { getWorkflowExecutionsHierarchical } = callbackUtils.getCallbacks;
  return getWorkflowExecutionsHierarchical(workflowName, mappedLabels, page, defaultPages.toString());
};

export const getSortOrder = (sortBy: SortBy, previousSortBy: SortBy, previousSortOrder: SortOrder): SortOrder => {
  if (sortBy !== previousSortBy) {
    return 'ASC';
  }

  return previousSortOrder === 'ASC' ? 'DESC' : 'ASC';
};

export const getWorkflows = (
  workflowId: string,
  labels: string[],
  start: number,
  size: number,
  sortBy: SortBy,
  sortOrder: SortOrder,
  isFlat: boolean,
) => {
  const { getWorkflowExecutions, getWorkflowExecutionsHierarchical } = callbackUtils.getCallbacks;
  const apiLabels = getApiLabels(labels);
  return isFlat
    ? getWorkflowExecutions(workflowId, apiLabels, start, size.toString(), sortBy, sortOrder)
    : getWorkflowExecutionsHierarchical(workflowId, apiLabels, start, size.toString(), sortBy, sortOrder);
};
