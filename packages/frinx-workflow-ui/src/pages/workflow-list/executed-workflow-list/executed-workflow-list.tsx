import './WorkflowExec.css';
import * as bulkActions from '../../../store/actions/bulk';
import * as searchActions from '../../../store/actions/search-execs';
import DetailsModal from './details-modal/details-modal';
import PageContainer from '../../../common/PageContainer';
import PageCount from '../../../common/PageCount';
import PageSelect from '../../../common/PageSelect';
import React, { ChangeEvent, Component } from 'react';
import WfAutoComplete from '../../../common/wf-autocomplete';
import WorkflowBulk from './WorkflowBulk/workflow-bulk';
import moment from 'moment';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  FormControl,
  Grid,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { connect, RootStateOrAny } from 'react-redux';
import { ExecutedWorkflow, NestedExecutedWorkflow } from '../../../types/types';

type Props = {
  query: string;
  onWorkflowIdClick: (wfId: string) => void;
};

type StateProps = {
  selectedWfs: string[];
  detailsModal: boolean;
  wfId: string;
  openParentWfs: NestedExecutedWorkflow[];
  closeDetails: boolean;
  allData: boolean;
  showChildren: NestedExecutedWorkflow[];
  defaultPages: number;
  pagesCount: number;
  viewedPage: number;
  datasetLength: number;
  timeout: NodeJS.Timeout;
  sort: number[];
};
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxStateProps = ReturnType<typeof mapStateToProps>;
type ComponentProps = Props & DispatchProps & ReduxStateProps & StateProps;

const initialState = {
  query: '',
  selectedWfs: [],
  detailsModal: false,
  wfId: '',
  openParentWfs: [],
  closeDetails: true,
  allData: false,
  showChildren: [],
  defaultPages: 20,
  pagesCount: 1,
  viewedPage: 1,
  datasetLength: 0,
  timeout: setTimeout(() => {}, 0),
  sort: [2, 2, 2],
};

class WorkflowExec extends Component<ComponentProps, StateProps> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    if (this.props.query) {
      this.props.updateByQuery(this.props.query);
    }
    const fetchFn = this.state.allData ? this.props.fetchNewData : this.props.fetchParentWorkflows;

    fetchFn(this.state.viewedPage, this.state.defaultPages);
  }

  componentDidUpdate(prevProps: Props, prevState: StateProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({
        allData: true,
        wfId: this.props.query,
        detailsModal: false,
        closeDetails: true,
        viewedPage: 1,
      });
      if (this.props.query) {
        this.props.updateByQuery(this.props.query);
      }
    }

    const { data, query, parents, size } = this.props.searchReducer;
    const dataset = this.state.allData ? data : parents;
    if (
      dataset.length === 1 &&
      query !== '' &&
      !this.state.detailsModal &&
      this.state.closeDetails &&
      this.props.query
    ) {
      this.showDetailsModal(this.props.query);
    }

    if (size !== this.state.datasetLength) {
      let pagesCount = ~~(size / this.state.defaultPages);
      this.setState({
        pagesCount: size % this.state.defaultPages ? ++pagesCount : pagesCount,
        datasetLength: size,
      });
    }

    if (prevState.allData !== this.state.allData || this.props.query !== prevProps.query) {
      if (this.state.allData) {
        this.props.fetchNewData(this.state.viewedPage, this.state.defaultPages);
      } else {
        this.props.checkedWorkflows([0]);
        this.props.fetchParentWorkflows(this.state.viewedPage, this.state.defaultPages);
        this.update([], []);
      }
    }
  }

  componentWillUnmount() {
    this.clearView();
  }

  clearView() {
    this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
    this.props.updateByQuery('');
    this.props.updateByLabel([]);
    this.update([], []);
  }

  update(openParents: NestedExecutedWorkflow[], showChildren: NestedExecutedWorkflow[]) {
    this.setState({
      openParentWfs: openParents,
      showChildren: showChildren,
    });
  }

  showChildrenWorkflows(
    workflow: NestedExecutedWorkflow,
    closeParentWfs: NestedExecutedWorkflow[] | null,
    closeChildWfs: NestedExecutedWorkflow[] | null,
  ) {
    const childrenDataset: NestedExecutedWorkflow[] = this.props.searchReducer.children;
    if (childrenDataset.length) {
      childrenDataset.forEach((wf: any, index: number) => (wf.index = index));
    }

    let showChildren = closeChildWfs ? closeChildWfs : this.state.showChildren;
    let openParents = closeParentWfs ? closeParentWfs : this.state.openParentWfs;

    if (openParents.filter((wfs) => wfs.startTime === workflow.startTime).length) {
      const closeParents = openParents.filter((wf) => wf.parentWorkflowId === workflow.workflowId);
      this.props.deleteParents(showChildren.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      openParents = openParents.filter((wfs) => wfs.startTime !== workflow.startTime);
      showChildren = showChildren.filter((wf) => wf.parentWorkflowId !== workflow.workflowId);
      closeParents.length
        ? closeParents.forEach((open) => this.showChildrenWorkflows(open, openParents, showChildren))
        : this.update(openParents, showChildren);
    } else {
      openParents.push(workflow);
      showChildren = showChildren.concat(childrenDataset.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      this.props.updateParents(showChildren.filter((wf) => wf.parentWorkflowId === workflow.workflowId));
      this.update(openParents, showChildren);
    }
  }

  indent(wf: NestedExecutedWorkflow[], i: number, size?: number) {
    const indentSize = size ? size : 6;
    if (wf[i].parentWorkflowId) {
      let layers = 0;
      if (this.state.showChildren.some((child) => child.workflowId === wf[i].parentWorkflowId)) {
        let parent = wf[i];
        while (parent.parentWorkflowId) {
          layers++;
          parent = wf[wf.findIndex((id) => id.workflowId === parent.parentWorkflowId)];
          if (layers > 10) break;
        }
        return layers * indentSize + 'px';
      }
      return indentSize + 'px';
    }
    return '0px';
  }

  setCountPages(defaultPages: number, pagesCount: number) {
    if (this.state.allData) {
      this.props.fetchNewData(1, defaultPages);
    } else {
      this.props.updateSize(1);
      this.props.checkedWorkflows([0]);
      this.props.fetchParentWorkflows(1, defaultPages);
      this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
      this.update([], []);
    }
    this.setState({
      defaultPages: defaultPages,
      pagesCount: pagesCount,
      viewedPage: 1,
    });
  }

  setViewPage(page: number) {
    if (this.state.allData) {
      this.props.fetchNewData(page, this.state.defaultPages);
    } else {
      this.props.fetchParentWorkflows(page, this.state.defaultPages);
      this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
      this.update([], []);
    }
    this.setState({
      viewedPage: page,
      sort: [2, 2, 2],
    });
  }

  dynamicSort(property: string) {
    let sortOrder = true;
    if (property[0] === '-') {
      sortOrder = false;
      property = property.slice(1);
    }
    return (a: { [key: string]: any }, b: { [key: string]: any }) => {
      if (!a['parentWorkflowId'] && !b['parentWorkflowId']) {
        return !sortOrder ? b[property].localeCompare(a[property]) : a[property].localeCompare(b[property]);
      }
    };
  }

  repeat() {
    const { data, parents, children } = this.props.searchReducer;
    const childSet: NestedExecutedWorkflow[] = children;
    const parentsId = childSet ? childSet.map((wf) => wf.parentWorkflowId) : [];
    const output = [];
    let dataset = this.state.allData ? data : parents;
    const sort = this.state.sort;
    for (let i = 0; i < sort.length; i++) {
      if (i === 0 && sort[i] !== 2)
        dataset = dataset.sort(this.dynamicSort(sort[i] ? '-workflowType' : 'workflowType'));
      if (i === 1 && sort[i] !== 2) dataset = dataset.sort(this.dynamicSort(sort[i] ? '-startTime' : 'startTime'));
      if (i === 2 && sort[i] !== 2) dataset = dataset.sort(this.dynamicSort(sort[i] ? '-endTime' : 'endTime'));
    }
    for (let i = 0; i < dataset.length; i++) {
      output.push(
        <Tr
          key={`row-${i}`}
          id={`row-${i}`}
          className={
            this.state.showChildren.some((wf) => wf.workflowId === dataset[i]['workflowId']) && !this.state.allData
              ? 'childWf'
              : undefined
          }
        >
          <Td>
            <Checkbox
              isChecked={this.state.selectedWfs.includes(dataset[i]['workflowId'])}
              onChange={(e) => this.selectWf(e)}
              marginLeft={20}
              id={`chb-${i}`}
            />
          </Td>
          {this.state.allData ? null : (
            <Td
              className="clickable"
              onClick={() => this.showChildrenWorkflows.bind(this)(dataset[i], null, null)}
              style={{ textIndent: this.indent(dataset, i) }}
            >
              {parentsId.includes(dataset[i]['workflowId']) ? (
                this.state.openParentWfs.filter((wf) => wf['startTime'] === dataset[i]['startTime']).length ? (
                  <i className="fas fa-minus" />
                ) : (
                  <i className="fas fa-plus" />
                )
              ) : null}
            </Td>
          )}
          <Td
            onClick={() => this.showDetailsModal.bind(this)(dataset[i]['workflowId'])}
            className="clickable"
            style={{
              textIndent: this.indent(dataset, i, 20),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={dataset[i]['workflowType']}
          >
            {dataset[i]['workflowType']}
          </Td>
          <Td>{dataset[i]['status']}</Td>
          <Td>{moment(dataset[i]['startTime']).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
          <Td>{dataset[i].endTime ? moment(dataset[i]['endTime']).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
        </Tr>,
      );
    }

    return output;
  }

  selectWfView() {
    this.clearView();
    this.props.updateSize(1);
    this.setState({
      allData: !this.state.allData,
      viewedPage: 1,
      sort: [2, 2, 2],
    });
  }

  selectWf(e: ChangeEvent<HTMLInputElement>) {
    const { data, parents } = this.props.searchReducer;
    const dataset = this.state.allData ? data : parents;
    const rowNum = e.target.id.split('-')[1];

    let wfIds = this.state.selectedWfs;
    const wfId: string = dataset[rowNum]['workflowId'];

    if (wfIds.includes(wfId)) {
      const idx = wfIds.indexOf(wfId);
      if (idx !== -1) {
        wfIds.splice(idx, 1);
      }
    } else {
      wfIds.push(wfId);
      if (!this.state.allData) {
        wfIds = this.selectChildrenWf(wfId, wfIds);
      }
    }
    this.setState({
      selectedWfs: wfIds,
    });
  }

  selectChildrenWf(parentId: string, wfIds: string[]) {
    const { children } = this.props.searchReducer;
    const newWfIds = children
      .filter((wf: NestedExecutedWorkflow) => wf.parentWorkflowId === parentId)
      .map((wf: NestedExecutedWorkflow) => wf.workflowId);
    for (let i = 0; i < newWfIds.length; i++) wfIds = wfIds.concat(this.selectChildrenWf(newWfIds[i], newWfIds));
    return [...new Set(wfIds)];
  }

  selectAllWfs() {
    const { data, parents, children } = this.props.searchReducer;
    const hiddenChildren: NestedExecutedWorkflow[] = children.filter(
      (obj: NestedExecutedWorkflow) => !this.state.showChildren.some((obj2) => obj.startTime === obj2.startTime),
    );
    const dataset = this.state.allData ? data : parents.concat(hiddenChildren);
    const wfIds: string[] = [];

    if (this.state.selectedWfs.length > 0) {
      this.setState({ selectedWfs: [] });
    } else {
      dataset.map((entry: ExecutedWorkflow) => {
        if (!this.state.selectedWfs.includes(entry.workflowId)) {
          wfIds.push(entry.workflowId);
        }
        return null;
      });
      this.setState({ selectedWfs: wfIds });
    }
  }

  showDetailsModal(workflowId?: string) {
    if (workflowId == null || workflowId.trim() === '') return;

    this.setState(
      {
        wfId: workflowId,
      },
      () => {
        this.setState({
          detailsModal: !this.state.detailsModal,
          closeDetails: !this.state.detailsModal,
        });
      },
    );
  }

  changeQuery(e: string) {
    this.props.updateByQuery(e);
    if (!this.state.allData) {
      this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
      this.update([], []);
      this.props.updateSize(1);
      this.props.checkedWorkflows([0]);
    }
    if (this.state.timeout) clearTimeout(this.state.timeout);
    this.setState({
      timeout: setTimeout(() => {
        this.state.allData
          ? this.props.fetchNewData(1, this.state.defaultPages)
          : this.props.fetchParentWorkflows(1, this.state.defaultPages);
      }, 300),
      viewedPage: 1,
      sort: [2, 2, 2],
    });
  }

  changeLabels(e: string[]) {
    this.props.updateByLabel(e);
    if (this.state.allData) {
      this.props.fetchNewData(1, this.state.defaultPages);
    } else {
      this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
      this.update([], []);
      this.props.updateSize(1);
      this.props.checkedWorkflows([0]);
      this.props.fetchParentWorkflows(1, this.state.defaultPages);
    }
    this.setState({
      viewedPage: 1,
      sort: [2, 2, 2],
    });
  }

  sortWf(number: number) {
    const sort = this.state.sort;
    for (let i = 0; i < sort.length; i++) {
      i === number ? (sort[i] = sort[i] === 2 ? 0 : sort[i] === 0 ? 1 : 0) : (sort[i] = 2);
    }
    if (!this.state.allData) {
      this.state.openParentWfs.forEach((parent) => this.showChildrenWorkflows(parent, null, null));
      this.update([], []);
    }
    this.setState({
      sort: sort,
    });
  }

  changeView() {
    this.props.setView(!this.state.allData);
    this.selectWfView();
  }

  render() {
    const detailsModal = this.state.detailsModal ? (
      <DetailsModal
        wfId={this.state.wfId}
        modalHandler={this.showDetailsModal}
        refreshTable={
          this.state.allData
            ? this.props.fetchNewData.bind(this, 1, this.state.defaultPages)
            : this.props.fetchParentWorkflows.bind(this, 1, this.state.defaultPages)
        }
        onWorkflowIdClick={this.props.onWorkflowIdClick}
      />
    ) : null;

    return (
      <PageContainer>
        {detailsModal}
        <WorkflowBulk
          wfsCount={this.repeat().length}
          selectedWfs={this.state.selectedWfs}
          pageCount={this.state.defaultPages}
          selectAllWfs={this.selectAllWfs.bind(this)}
          bulkOperation={this.clearView.bind(this)}
        />

        <Flex alignItems="center" marginBottom={4}>
          <Text marginRight={4}>Workflow view</Text>

          <ButtonGroup size="sm" isAttached colorScheme="blue" onChange={this.changeView.bind(this)}>
            <Button
              variant={this.state.allData ? 'outline' : 'solid'}
              onClick={() => (this.state.allData ? this.changeView() : null)}
            >
              Hierarchy
            </Button>
            <Button
              variant={this.state.allData ? 'solid' : 'outline'}
              onClick={() => (this.state.allData ? null : this.changeView())}
            >
              Flat
            </Button>
          </ButtonGroup>
        </Flex>

        <Grid templateColumns="1fr 1fr 40px" gap={4} marginBottom={8}>
          <Box flexGrow={1}>
            <WfAutoComplete
              options={['RUNNING', 'COMPLETED', 'FAILED', 'TIMED_OUT', 'TERMINATED', 'PAUSED']}
              onChange={(e) => this.changeLabels(e)}
              selected={this.props.searchReducer.label}
              placeholder="Search by status."
            />
          </Box>
          <Box flexGrow={1}>
            <FormControl>
              <Input
                value={this.props.searchReducer.query}
                onChange={(e) => this.changeQuery(e.target.value)}
                placeholder="Search by keyword."
                background="white"
              />
            </FormControl>
          </Box>
          <Button
            className="primary"
            colorScheme="blue"
            onClick={() => {
              this.changeLabels([]);
              this.changeQuery('');
            }}
          >
            <i className="fas fa-times" />
          </Button>
        </Grid>
        <div className="execTableWrapper">
          <Table background="white" variant={this.state.allData ? 'striped' : 'simple'}>
            <Thead>
              <Tr>
                <Th> </Th>
                {this.state.allData ? null : <Th>Children</Th>}
                <Th onClick={this.sortWf.bind(this, 0)} className="clickable">
                  Name &nbsp;
                  {this.state.sort[0] !== 2 ? (
                    <i className={this.state.sort[0] ? 'fas fa-sort-up' : 'fas fa-sort-down'} />
                  ) : null}
                </Th>
                <Th>Status</Th>
                <Th onClick={this.sortWf.bind(this, 1)} className="clickable">
                  Start Time &nbsp;
                  {this.state.sort[1] !== 2 ? (
                    <i className={this.state.sort[1] ? 'fas fa-sort-down' : 'fas fa-sort-up'} />
                  ) : null}
                </Th>
                <Th onClick={this.sortWf.bind(this, 2)} className="clickable">
                  End Time &nbsp;
                  {this.state.sort[2] !== 2 ? (
                    <i className={this.state.sort[2] ? 'fas fa-sort-down' : 'fas fa-sort-up'} />
                  ) : null}
                </Th>
              </Tr>
            </Thead>
            <Tbody className="execTableRows">{this.repeat()}</Tbody>
          </Table>
        </div>
        <Box marginTop={5}>
          <Flex justifyContent="space-between">
            <Box>
              <PageCount
                dataSize={this.props.searchReducer.size}
                defaultPages={this.state.defaultPages}
                handler={this.setCountPages.bind(this)}
              />
            </Box>
            <Box>
              <PageSelect
                viewedPage={this.state.viewedPage}
                count={this.state.pagesCount}
                indent={1}
                handler={this.setViewPage.bind(this)}
              />
            </Box>
          </Flex>
        </Box>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: ReturnType<RootStateOrAny>) => {
  return {
    searchReducer: state.searchReducer,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    updateByQuery: (query: string) => dispatch(searchActions.updateQuery(query)),
    updateByLabel: (label: string[]) => dispatch(searchActions.updateLabel(label)),
    fetchNewData: (viewedPage: number, defaultPages: number) =>
      dispatch(searchActions.fetchNewData(viewedPage, defaultPages)),
    fetchParentWorkflows: (viewedPage: number, defaultPages: number) =>
      dispatch(searchActions.fetchParentWorkflows(viewedPage, defaultPages)),
    updateParents: (children: NestedExecutedWorkflow[]) => dispatch(searchActions.updateParents(children)),
    deleteParents: (children: NestedExecutedWorkflow[]) => dispatch(searchActions.deleteParents(children)),
    updateSize: (size: number) => dispatch(searchActions.updateSize(size)),
    checkedWorkflows: (checkedWfs: number[]) => dispatch(searchActions.checkedWorkflows(checkedWfs)),
    setView: (value: unknown) => dispatch(bulkActions.setView(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowExec);
