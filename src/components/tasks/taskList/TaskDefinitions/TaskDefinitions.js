import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
  Table
} from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import "./TaskDefinitions.css";
import PageSelect from "../../../common/PageSelect";
import PageCount from "../../../common/PageCount";
import TaskModal from "./TaskModal/TaskModal";
const http = require("../../../../server/HttpServerSide").HttpClient;

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      data: [],
      table: [],
      highlight: [],
      defaultPages: 20,
      pagesCount: 1,
      viewedPage: 1,
      sorted: false,
      taskModal: false,
      taskName: null
    };
    library.add(faSync);
    this.table = React.createRef();
    this.onEditSearch = this.onEditSearch.bind(this);
  }

  componentWillMount() {
    this.search();
  }

  componentDidMount() {
    http.get("/api/conductor/metadata/taskdefs").then(res => {
      if (res.result) {
        let size = ~~(res.result.length / this.state.defaultPages);
        this.setState(
          {
            data: res.result || [],
            pagesCount: res.result
              ? res.result.length % this.state.defaultPages
                ? ++size
                : size
              : 0
          },
          () => this.sortArray("name")
        );
      }
    });
  }

  onEditSearch(event) {
    this.setState({ keywords: event.target.value }, () => {
      this.search();
    });
  }

  search() {
    let toBeRendered = [];
    let toBeHighlited = [];
    let query = this.state.keywords.toUpperCase();
    if (query !== "") {
      const rows = this.state.data;
      for (let i = 0; i < rows.length; i++) {
        for (let y = 1; y < Object.values(rows[i]).length; y++) {
          if (
            Object.values(rows[i])[y] &&
            Object.values(rows[i])[y]
              .toString()
              .toUpperCase()
              .indexOf(query) !== -1
          ) {
            toBeRendered.push(rows[i]);
            toBeHighlited.push(Object.keys(rows[i])[y]);
            break;
          }
        }
      }
    } else {
      toBeRendered = this.state.data;
    }
    let pages =
      toBeRendered.length === 0
        ? 0
        : ~~(toBeRendered.length / this.state.defaultPages) + 1;

    this.setState({
      table: toBeRendered,
      highlight: toBeHighlited,
      pagesCount: pages
    });
  }

  calculateHighlight(i, y) {
    if (this.state.highlight[i] === y) {
      return "hilit";
    } else {
      return "";
    }
  }

  handleTaskModal(name) {
    let taskName = name !== undefined ? name : null;
    this.setState({
      taskName: taskName,
      taskModal: !this.state.taskModal
    });
  }

  repeat() {
    let output = [];
    let highlight = "" === !this.state.keywords;
    let dataset =
      this.state.keywords === "" ? this.state.data : this.state.table;
    let defaultPages = this.state.defaultPages;
    let viewedPage = this.state.viewedPage;
    for (let i = 0; i < dataset.length; i++) {
      if (
        i >= (viewedPage - 1) * defaultPages &&
        i < viewedPage * defaultPages
      ) {
        output.push(
          <tr key={`row-${i}`} id={`row-${i}`}>
            <td
              className={
                highlight
                  ? this.calculateHighlight(i, "name") +
                    " leftAligned clickable"
                  : "leftAligned clickable"
              }
              onClick={this.handleTaskModal.bind(this, dataset[i]["name"])}
            >
              {dataset[i]["name"]}
            </td>
            <td
              className={
                highlight ? this.calculateHighlight(i, "timeoutPolicy") : ""
              }
            >
              {dataset[i]["timeoutPolicy"]}
            </td>
            <td
              className={
                highlight ? this.calculateHighlight(i, "timeoutSeconds") : ""
              }
            >
              {dataset[i]["timeoutSeconds"]}
            </td>
            <td
              className={
                highlight
                  ? this.calculateHighlight(i, "responseTimeoutSeconds")
                  : ""
              }
            >
              {dataset[i]["responseTimeoutSeconds"]}
            </td>
            <td
              className={
                highlight ? this.calculateHighlight(i, "retryCount") : ""
              }
            >
              {dataset[i]["retryCount"]}
            </td>
            <td
              className={
                highlight
                  ? this.calculateHighlight(i, "rateLimitPerFrequency")
                  : ""
              }
            >
              {dataset[i]["rateLimitPerFrequency"]}
            </td>
            <td
              className={
                highlight
                  ? this.calculateHighlight(i, "rateLimitFrequencyInSeconds")
                  : ""
              }
            >
              {dataset[i]["rateLimitFrequencyInSeconds"]}
            </td>
            <td
              className={
                highlight ? this.calculateHighlight(i, "retryLogic") : ""
              }
            >
              {dataset[i]["retryLogic"]}
            </td>
            <td>
              <Button
                variant="outline-danger noshadow"
                onClick={this.deleteTask.bind(this, dataset[i]["name"])}
              >
                <i className="fas fa-trash-alt" />
              </Button>
            </td>
          </tr>
        );
      }
    }
    return output;
  }

  deleteTask(name) {
    http.delete("/api/conductor/metadata/taskdef/" + name).then(res => {
      if (res.status === 200) {
        let dataset = this.state.data;
        let tableset = this.state.table;
        let index = dataset.findIndex(task => task.name === name);
        if (index > -1) dataset.splice(index, 1);
        index = tableset.findIndex(task => task.name === name);
        if (index > -1) tableset.splice(index, 1);
        this.setState({ data: dataset, table: tableset });
      }
    });
  }

  setCountPages(defaultPages, pagesCount) {
    this.setState({
      defaultPages: defaultPages,
      pagesCount: pagesCount,
      viewedPage: 1
    });
  }

  setViewPage(page) {
    this.setState({
      viewedPage: page
    });
  }

  sortAscBy = function(key) {
    return function(x, y) {
      return x[key] === y[key] ? 0 : x[key] > y[key] ? 1 : -1;
    };
  };

  sortDescBy = function(key) {
    return function(x, y) {
      return x[key] === y[key] ? 0 : x[key] < y[key] ? 1 : -1;
    };
  };

  sortArray(key) {
    let sortedArray = this.state.data;

    if (this.state.sorted) {
      sortedArray.sort(this.sortDescBy(key));
      this.setState({ sorted: false });
    }
    if (!this.state.sorted) {
      sortedArray.sort(this.sortAscBy(key));
      this.setState({ sorted: true });
    }

    this.setState({ data: sortedArray });
  }
  render() {
    let taskModal = this.state.taskModal ? (
      <TaskModal
        name={this.state.taskName}
        modalHandler={this.handleTaskModal.bind(this)}
        show={this.state.taskModal}
      />
    ) : null;

    return (
      <div className="listPage">
        {taskModal}
        <Container>
          <FormGroup className="searchGroup">
            <Form.Control
              value={this.state.keywords}
              onChange={this.onEditSearch}
              placeholder="Search by keyword."
            />
          </FormGroup>
          <div className="scrollWrapper">
            <Table ref={this.table} striped hover size="sm">
              <thead>
                <tr>
                  <th
                    className="clickable"
                    onClick={() => this.sortArray("name")}
                  >
                    Name/Version
                  </th>
                  <th>Timeout Policy</th>
                  <th>Timeout Seconds</th>
                  <th>Response Timeout</th>
                  <th>Retry Count</th>
                  <th>Rate Limit Amount</th>
                  <th>Rate Limit Frequency Seconds</th>
                  <th>Retry Logic</th>
                  <th />
                </tr>
              </thead>
              <tbody className="tasktable">{this.repeat()}</tbody>
            </Table>
          </div>
        </Container>
        <Container style={{ marginTop: "5px" }}>
          <Row>
            <Col sm={2}>
              <PageCount
                dataSize={
                  this.state.keywords === ""
                    ? this.state.data.length
                    : this.state.table.length
                }
                defaultPages={this.state.defaultPages}
                handler={this.setCountPages.bind(this)}
              />
            </Col>
            <Col sm={8} />
            <Col sm={2}>
              <PageSelect
                viewedPage={this.state.viewedPage}
                count={this.state.pagesCount}
                handler={this.setViewPage.bind(this)}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TaskList;
