import React, { useEffect, useState } from 'react';
import { Container, Progress } from '@chakra-ui/react';
import { ExecutedWorkflow, ExecutedWorkflows, NestedExecutedWorkflow } from '@frinx/workflow-ui/src/helpers/types';
import useQueryParams from '@frinx/workflow-ui/src/hooks/use-query-params';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import { useNavigate } from 'react-router-dom';
import ExecutedWorkflowSearchBox from './executed-workflow-searchbox/executed-workflow-searchbox';
import { getSortOrder, getWorkflows } from './search-execs';
import ExecutedWorkflowFlatTable from './executed-workflow-table/executed-workflow-table';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import { usePagination } from '../../../common/pagination-hook';

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
};

type SearchFilters = {
  page: number;
  size: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  labels: string[];
  search: string;
  isFlat: boolean;
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

const loadExecutedWorkflows = async (filters: SearchFilters): Promise<ExecutedWorkflows> => {
  const { page, size, sortBy, sortOrder, labels, search, isFlat } = filters;
  const executedWorkflows = await getWorkflows({
    isFlat,
    labels,
    size,
    sortBy,
    sortOrder,
    start: (page - 1) * size,
    workflowId: search,
  });

  return executedWorkflows;
};

const ExecutedWorkflowList = () => {
  const navigate = useNavigate();
  const query = useQueryParams();
  const [executedWorkflows, setExecutedWorkflows] = useState<ExecutedWorkflow[]>();
  const {
    currentPage,
    setCurrentPage,
    maxItemsPerPage,
    totalPages,
    pageItems: workflows,
    setTotalItemsAmount,
    totalItemsAmount,
    setItemList,
  } = usePagination<ExecutedWorkflow>({
    itemList: executedWorkflows,
    hasCustomAmount: true,
    maxItemsPerPage: 20,
  });
  const [state, setState] = useState<StateProps>({
    ...initialState,
    workflowId: query.get('search') || '',
  });

  useEffect(() => {
    loadExecutedWorkflows({
      page: currentPage,
      size: maxItemsPerPage,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      labels: state.labels,
      search: state.workflowId,
      isFlat: state.isFlat,
    }).then((exWfs) => {
      setExecutedWorkflows(exWfs.result.hits);
      setItemList(exWfs.result.hits);
      setTotalItemsAmount(exWfs.result.totalHits);
    });
  }, [
    state.sortBy,
    state.sortOrder,
    state.labels,
    state.workflowId,
    state.isFlat,
    currentPage,
    maxItemsPerPage,
    setTotalItemsAmount,
  ]);

  useEffect(() => {
    navigate({ search: state.workflowId ? `search=${state.workflowId}` : '' }, { replace: true });
  }, [state.workflowId, navigate]);

  useEffect(() => {
    setState((prev) => ({ ...prev, selectedWorkflows: [...new Set<string>()] }));
  }, [state.isFlat]);

  if (workflows == null) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  const changeLabels = (labels: string[]) => {
    setState((prev) => ({ ...prev, labels }));
    setCurrentPage(1);
  };

  const changeQuery = (changedQuery: string) => {
    setState((prev) => ({ ...prev, workflowId: changedQuery }));
    setCurrentPage(1);
  };

  const selectWorkflow = (workflowId: string, isChecked: boolean) => {
    const selectedWorkflows = new Set(state.selectedWorkflows);

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
        const selectedWorkflows = new Set(workflows.map((workflow) => workflow.workflowId));

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
    setCurrentPage(1);
  };

  const handleSuccessfullOperation = () => {
    loadExecutedWorkflows({
      page: currentPage,
      size: maxItemsPerPage,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      labels: state.labels,
      search: state.workflowId,
      isFlat: state.isFlat,
    }).then((exWfs) => {
      setExecutedWorkflows(exWfs.result.hits);
      setTotalItemsAmount(exWfs.result.totalHits);
    });
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <ExecutedWorkflowBulkOperationsBlock
        workflowsAmount={totalItemsAmount}
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

      <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} showPageNumbers />
    </Container>
  );
};

export default ExecutedWorkflowList;
