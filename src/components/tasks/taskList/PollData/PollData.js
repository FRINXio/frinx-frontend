import React from "react";
import { Row, Form, Col, Table, Container } from "react-bootstrap";
import moment from "moment";
import { connect } from "react-redux";
import "./PollData.css";
import PageCount from "../../../common/PageCount";
import PageSelect from "../../../common/PageSelect";
const http = require("../../../../server/HttpServerSide").HttpClient;

class PollData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queueData: [],
      table: [],
      sorted: false,
      search: "",
      defaultPages: 20,
      pagesCount: 1,
      viewedPage: 1
    };
    this.table = React.createRef();
  }

  componentWillMount() {
    http.get("/api/conductor/queue/data").then(data => {
      if (data.polldata) {
        let size = ~~(data.polldata.length / this.state.defaultPages);
        this.setState({
          queueData: data.polldata,
          pagesCount: data.polldata
            ? data.polldata.length % this.state.defaultPages
              ? ++size
              : size
            : 0
        });
      }
    });
  }

  componentWillReceiveProps({ queueData }) {
    this.setState({ queueData });
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
    let sortedArray = this.state.queueData;

    if (this.state.sorted) {
      sortedArray.sort(this.sortDescBy(key));
      this.setState({ sorted: false });
    }
    if (!this.state.sorted) {
      sortedArray.sort(this.sortAscBy(key));
      this.setState({ sorted: true });
    }

    this.setState({ queueData: sortedArray });
  }

  search(e) {
    let dataset = this.state.queueData.filter(item => {
      return (
        item["queueName"]
          .toString()
          .toLowerCase()
          .includes(e.target.value.toString().toLowerCase()) ||
        item["workerId"]
          .toString()
          .toLowerCase()
          .includes(e.target.value.toString().toLowerCase())
      );
    });
    let size = ~~(dataset.length / this.state.defaultPages);
    this.setState({
      table: dataset,
      viewedPage: 1,
      pagesCount: dataset
        ? dataset.length % this.state.defaultPages
          ? ++size
          : size
        : 0,
      search: e.target.value
    });
  }

  repeat() {
    let output = [];
    let dataset =
      this.state.search !== "" ? this.state.table : this.state.queueData;
    let defaultPages = this.state.defaultPages;
    let viewedPage = this.state.viewedPage;

    for (let i = 0; i < dataset.length; i++) {
      if (
        i >= (viewedPage - 1) * defaultPages &&
        i < viewedPage * defaultPages
      ) {
        output.push(
          <tr key={`row-${i}`} id={`row-${i}`}>
            <td>{dataset[i]["queueName"]}</td>
            <td>{dataset[i]["qsize"]}</td>
            <td>{moment(dataset[i]["lastPollTime"]).fromNow()}</td>
            <td>{dataset[i]["workerId"]}</td>
          </tr>
        );
      }
    }
    return output;
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

  render() {
    return (
      <div>
        <Row>
          <Col>
            <h4>Queues</h4>
          </Col>
          <Col>
            <Form.Group className="searchGroup">
              <Form.Control
                value={this.state.search}
                onChange={e => this.search(e)}
                placeholder="Search"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="ui-content">
          <Table ref={this.table} striped hover size="sm">
            <thead>
              <tr>
                <th
                  className="clickable"
                  onClick={() => this.sortArray("queueName")}
                >
                  Name (Domain)
                </th>
                <th
                  className="clickable"
                  onClick={() => this.sortArray("qsize")}
                >
                  Size
                </th>
                <th
                  className="clickable"
                  onClick={() => this.sortArray("lastPollTime")}
                >
                  Last Poll Time
                </th>
                <th
                  className="clickable"
                  onClick={() => this.sortArray("workerId")}
                >
                  Last Polled By
                </th>
              </tr>
            </thead>
            <tbody className="polltable">{this.repeat()}</tbody>
          </Table>
        </div>
        <Container style={{ marginTop: "5px" }}>
          <Row>
            <Col sm={2}>
              <PageCount
                dataSize={
                  this.state.search !== ""
                    ? this.state.table.length
                    : this.state.queueData.length
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

export default connect()(PollData);
