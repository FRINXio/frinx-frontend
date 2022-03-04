import { Box, Container, Flex, Heading, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import SearchFilter, { getDefaultSearchFilters, SearchFilters } from './search-filter';
import SearchTable from './search-table';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/pagination/pagination';
import uniflowCallbackUtils from '../../uniflow-callback-utils';
import { getTransactionId } from '../../helpers/transaction-id';
import PollWorkflowId from '../../components/poll-workflow-id/poll-worfklow-id';
import { convertSearchItemToTableItem, SearchItem, TableItem } from './search-helper';
import unwrap from '../../helpers/unwrap';

type SearchData = SearchItem[];

type SearchWorkflowResult = {
  result: string;
  row_count: number; // eslint-disable-line @typescript-eslint/naming-convention
};

type SearchWorkflowInput = {
  /* eslint-disable @typescript-eslint/naming-convention */
  US_UI_TX: string;
  limit: number;
  offset: number;
  vpn_id: string;
  site_id: string;
  customer_name: string;
  ne_id: string;
  port_id: string;
  circuit_reference: string;
  device_id: string;
  bearer_reference: string;
  site_role: string;
  sp_bearer_reference: string;
  /* eslint-enable @typescript-eslint/naming-convention */
};

function getWorkflowInput(
  filters: SearchFilters,
  transactionId: string,
  page: number,
  pageSize: number,
): SearchWorkflowInput {
  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    US_UI_TX: transactionId,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    vpn_id: filters.vpnId || '',
    site_id: filters.siteId || '',
    customer_name: filters.customerName || '',
    ne_id: filters.neId || '',
    port_id: filters.portId || '',
    circuit_reference: filters.circuitReference || '',
    device_id: filters.deviceId || '',
    bearer_reference: filters.bearerReference || '',
    site_role: filters.siteRole || '',
    sp_bearer_reference: filters.spBearerReference || '',
    /* eslint-enable @typescript-eslint/naming-convention */
  };
}

const CreateVpnServicePage: VoidFunctionComponent = () => {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<TableItem[] | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pagination, setPagination] = usePagination();
  const [filters, setFilters] = useState<SearchFilters>(getDefaultSearchFilters());
  const [submittedFilters, setSubmittedFilters] = useState<SearchFilters>(getDefaultSearchFilters());

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
      const transactionId = unwrap(getTransactionId());
      const uniflowCallbacks = uniflowCallbackUtils.getCallbacks;
      const filtersInput = getWorkflowInput(submittedFilters, transactionId, pagination.page, pagination.pageSize);
      try {
        const workflowResult = await uniflowCallbacks.executeWorkflow({
          name: 'UI_site_network_access_view',
          version: 1,
          input: {
            ...filtersInput,
          },
        });
        setWorkflowId(workflowResult.text);
      } catch {
        setIsFetchingData(false);
      }
    };

    setSearchResult(null);
    fetchData();
  }, [pagination.page, submittedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePageChange(page: number) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handleFilterChange(newFilters: SearchFilters) {
    setFilters({
      ...newFilters,
    });
  }

  function handleFilterSubmit() {
    setPagination({
      ...pagination,
      page: 1,
    });
    setSubmittedFilters(filters);
  }

  function handleRowClick(rowId: string, isOpen: boolean) {
    setDetailId(isOpen ? rowId : null);
  }

  function handleWorkflowFinish(data: string | null) {
    if (!data) {
      setIsFetchingData(false);
      return;
    }

    const { result, row_count }: SearchWorkflowResult = JSON.parse(data); // eslint-disable-line @typescript-eslint/naming-convention

    const rows: SearchData = JSON.parse(result);
    const tableData = rows.map(convertSearchItemToTableItem);
    setSearchResult(tableData);
    setWorkflowId(null);
    setPagination({
      ...pagination,
      pageCount: Math.ceil(row_count / pagination.pageSize),
    });
    setIsFetchingData(false);
  }

  return (
    <>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="lg">
            Search
          </Heading>
        </Flex>
        <Box>
          <>
            <SearchFilter
              isFetching={isFetchingData}
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
            />
            {isFetchingData && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}
            {isFetchingData && workflowId && (
              <PollWorkflowId workflowId={unwrap(workflowId)} onFinish={handleWorkflowFinish} />
            )}
            {searchResult && (
              <>
                <SearchTable size="md" detailId={detailId} rows={searchResult} onRowClick={handleRowClick} />
                <Box m="4">
                  <Pagination page={pagination.page} count={pagination.pageCount} onPageChange={handlePageChange} />
                </Box>
              </>
            )}
          </>
        </Box>
      </Container>
    </>
  );
};

export default CreateVpnServicePage;
