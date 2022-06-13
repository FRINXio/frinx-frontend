import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { ExecutedWorkflow } from '../../../helpers/types';

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
  return getWorkflowExecutions({
    workflowId: workflowName,
    label: mappedLabels,
    start: page,
    size: defaultPages.toString(),
  });
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
  return getWorkflowExecutionsHierarchical({
    workflowId: workflowName,
    label: mappedLabels,
    start: page,
    size: defaultPages.toString(),
  });
};

// TODO: currently not used
// this function can be used to detect if workflow has subworkflows by parsing its output
// we can use it to further optimize ui, for example in hierarchical view the row can be
// non clickable if it does not have subworkflows
// if this function is not necessary, we can remove it
export const getSubWorkflowIds = (workflow: ExecutedWorkflow): string[] => {
  const regex = /subWorkflowId=([^,]*),/g;
  const result = workflow.output.matchAll(regex);

  let output: string[] = [];

  for (const r of result) {
    output.push(r[1]);
  }

  return output;
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
    ? getWorkflowExecutions({ workflowId, label: apiLabels, start, size: size.toString(), sortBy, sortOrder })
    : getWorkflowExecutionsHierarchical({
        workflowId,
        label: apiLabels,
        start,
        size: size.toString(),
        sortBy,
        sortOrder,
      });
};
