import PageContainer from '../../../common/PageContainer';
import React, { useEffect, useState } from 'react';
import { Progress } from '@chakra-ui/react';
import { ExecutedWorkflows, NestedExecutedWorkflow } from '@frinx/workflow-ui/src/helpers/types';
import ExecutedWorkflowSearchBox from './executed-workflow-searchbox/executed-workflow-searchbox';
import { useNavigate } from 'react-router-dom';
import { getSortOrder, getWorkflows } from './search-execs';
import ExecutedWorkflowFlatTable from './executed-workflow-table/executed-workflow-table';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import useQueryParams from '@frinx/workflow-ui/src/hooks/use-query-params';
import usePagination, { PaginationState } from '../../../hooks/use-pagination';

type SortBy = 'workflowType' | 'startTime' | 'endTime' | 'status';
type SortOrder = 'ASC' | 'DESC';

type StateProps = {
  selectedWorkflows: string[];
  detailsModal: boolean;
  workflowId: string;
  openParentWorkflows: NestedExecutedWorkflow[];
  isFlat: boolean;
  showChildren: NestedExecutedWorkflow[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  labels: string[];
  //state: any;
};

const initialState: StateProps = {
  selectedWorkflows: [],
  detailsModal: false,
  workflowId: '',
  openParentWorkflows: [],
  isFlat: false,
  showChildren: [],
  sortBy: 'startTime',
  sortOrder: 'DESC',
  labels: [],
};
const fetchData = async (state: StateProps, pagination: PaginationState) => {
  const executedWorkflows = await getWorkflows(
    state.workflowId,
    state.labels,
    (pagination.page - 1) * pagination.pageSize,
    pagination.pageSize,
    state.sortBy,
    state.sortOrder,
    state.isFlat,
  );
  return executedWorkflows;
};

const ExecutedWorkflowList = () => {
  const navigate = useNavigate();
  const query = useQueryParams();
  const [pagination, setPagination] = usePagination();
  const searchKeyword = query.get('search') || '';

  const [state, setState] = useState<StateProps>({
    ...initialState,
    workflowId: searchKeyword,
  });

  const [workflows, setWorkflows] = useState<ExecutedWorkflows | null>(null);

  useEffect(() => {
    fetchData(state, pagination).then((executedWorkflows) => {
      setWorkflows(executedWorkflows);
      setPagination((prev) => ({ ...prev, pageCount: Math.ceil(executedWorkflows.result.totalHits / prev.pageSize) }));
    });
  }, [
    state.workflowId,
    state.isFlat,
    state.sortOrder,
    state.sortBy,
    pagination.page,
    pagination.pageSize,
    state.labels,
  ]);

  useEffect(() => {
    navigate({ search: state.workflowId ? `search=${state.workflowId}` : '' }, { replace: true });
  }, [state.workflowId]);

  useEffect(() => {
    setState((prev) => ({ ...prev, selectedWorkflows: [...new Set<string>()] }));
  }, [state.isFlat]);

  if (workflows == null) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  const changeLabels = (labels: string[]) => {
    setState((prev) => ({ ...prev, labels }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const changeQuery = (query: string) => {
    setState((prev) => ({ ...prev, workflowId: query }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const selectWorkflow = (workflowId: string, isChecked: boolean) => {
    let selectedWorkflows = new Set(state.selectedWorkflows);

    if (isChecked) {
      selectedWorkflows.add(workflowId);
    } else {
      selectedWorkflows.delete(workflowId);
    }

    setState((prev) => {
      return {
        ...prev,
        selectedWorkflows: [...selectedWorkflows],
      };
    });
  };

  const selectAllWorkflows = (isChecked: boolean) => {
    if (isChecked) {
      setState((prev) => {
        const selectedWorkflows = new Set(workflows.result.hits.map((workflow) => workflow.workflowId));

        return { ...prev, selectedWorkflows: [...selectedWorkflows] };
      });
    } else {
      setState((prev) => ({ ...prev, selectedWorkflows: [] }));
    }
  };

  const sortWorkflow = (sortBy: SortBy) => {
    setState((prev) => ({
      ...prev,
      sortBy,
      sortOrder: getSortOrder(sortBy, prev.sortBy, prev.sortOrder),
    }));
  };

  const changeView = () => {
    setState((prev) => ({ ...prev, isFlat: !prev.isFlat }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePaginationClick = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  const handleSuccessfullOperation = () => {
    fetchData(state, pagination);
  };

  return (
    <PageContainer>
      <ExecutedWorkflowBulkOperationsBlock
        workflowsAmount={workflows.result.totalHits}
        selectedWorkflows={state.selectedWorkflows}
        selectAllWorkflows={selectAllWorkflows}
        onSuccessfullOperation={handleSuccessfullOperation}
      />

      <ExecutedWorkflowSearchBox
        changeLabels={changeLabels}
        showFlat={state.isFlat}
        changeQuery={changeQuery}
        changeView={changeView}
        labels={state.labels}
      />

      <>
        <ExecutedWorkflowFlatTable
          selectAllWorkflows={selectAllWorkflows}
          sortWf={sortWorkflow}
          selectWf={selectWorkflow}
          selectedWfs={state.selectedWorkflows}
          sortBy={state.sortBy}
          sortOrder={state.sortOrder}
          workflows={workflows}
          isFlat={state.isFlat}
        />

        <Paginator
          currentPage={pagination.page}
          onPaginationClick={handlePaginationClick}
          pagesCount={pagination.pageCount}
          showPageNumbers={true}
        />
      </>
    </PageContainer>
  );
};

export default ExecutedWorkflowList;
