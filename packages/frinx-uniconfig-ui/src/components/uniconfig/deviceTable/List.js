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
import "./List.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPlusCircle,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import MountModal from "./mountModal/MountModal";
import DetailModal from "./detailModal/DetailModal";
import PageSelect from "../../common/PageSelect";
import PageCount from "../../common/PageCount";
import { HttpClient as http } from "../../common/HttpClient";
import { GlobalContext } from '../../common/GlobalContext';

class List extends Component {
  static contextType = GlobalContext
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      data: [],
      table: [],
      selectedDevices: [],
      deviceDetails: [],
      mountModal: false,
      detailModal: false,
      defaultPages: 20,
      pagesCount: 1,
      viewedPage: 1,
      sort: false,
      sortCategory: 0
    };
    library.add(faSync);
    this.table = React.createRef();
    this.onEditSearch = this.onEditSearch.bind(this);
    this.addDeviceEntry = this.addDeviceEntry.bind(this);
    this.showMountModal = this.showMountModal.bind(this);
    this.showDetailModal = this.showDetailModal.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentWillMount() {
    this.search();
  }

  componentDidMount() {
    this.refreshAllDeviceEntries();
  }

  onEditSearch(event) {
    this.setState({ keywords: event.target.value }, () => {
      this.search();
    });
  }

  async getDeviceEntry(node_id, topology) {
    let os_version;
    let device_object = await this.getDeviceObject(node_id, topology);

    //append os/version from conf
    if (topology === "cli") {
      os_version = await http
        .get(
          this.context.backendApiUrlPrefix +
            "/rests/data/network-topology:network-topology/topology=" +
            topology +
            "/node=" +
            node_id +
            "?content=config",
          this.context.authToken
        )
        .then((res) => {
          try {
            os_version = res["node"]["0"]["cli-topology:device-type"];
            os_version =
              os_version +
              " / " +
              res["node"]["0"]["cli-topology:device-version"];
            return os_version;
          } catch (e) {
            console.log(e);
          }
        });
    } else {
      os_version = "netconf";
    }
    if (device_object)
      return [
        device_object.node_id,
        device_object.host,
        device_object.status,
        os_version
      ];
  }

  async addDeviceEntry(node_id, topology) {
    let entry = await this.getDeviceEntry(node_id, topology);
    let updated = false;
    let newData = this.state.data;

    //check if entry already exists -> update
    newData.map((device, i) => {
      if (entry && device[0] === entry[0]) {
        newData[i] = entry;
        updated = true;
      }
      return updated;
    });

    if (entry && !updated) {
      newData.push(entry);
    }
    let size = ~~(newData.length / this.state.defaultPages);
    let pages = newData.length % this.state.defaultPages ? ++size : size;

    this.setState({
      data: newData,
      pagesCount: pages
    });
  }

  onDeviceSelect(e, data, id) {
    let node_id = data[0];
    let topology = data[3];

    if (e.target.checked) {
      this.state.selectedDevices.push({
        id: id,
        topology: topology,
        node_id: node_id
      });
    } else {
      for (let key in this.state.selectedDevices) {
        let id = this.state.selectedDevices[key].id;
        if (id !== e.target.id) {
          this.state.selectedDevices.splice(key, 1);
        }
      }
    }
  }

  onDeviceRefresh(e, data) {
    let refreshBtnID = e.target.id;
    let refreshBtnElem = document.getElementById(refreshBtnID);
    refreshBtnElem.classList.add("fa-spin");
    setTimeout(() => {
      refreshBtnElem.classList.remove("fa-spin");
    }, 1000);

    let node_id = data[0];
    let topology = data[3] === "netconf" ? "topology-netconf" : "cli";
    let updatedData = this.state.data;

    updatedData.map(device => {
      if (device[0] === node_id) {
        return this.addDeviceEntry(node_id, topology);
      }
      return true;
    });
  }

  removeDevices() {
    this.state.selectedDevices.map(device => {
      if (device["topology"] === "netconf") {
        return http.delete(
          this.context.backendApiUrlPrefix +
            "/rests/data/network-topology:network-topology/topology=topology-netconf/node=" +
            device["node_id"],
          this.context.authToken
        );
      } else {
        return http.delete(
          this.context.backendApiUrlPrefix +
            "/rests/data/network-topology:network-topology/topology=cli/node=" +
            device["node_id"],
          this.context.authToken
        );
      }
    });
    this.setState({ selectedDevices: [] });
    setTimeout(this.refreshAllDeviceEntries.bind(this), 300);
  }

  refreshAllDeviceEntries() {
    this.setState({ data: [], mountModal: false });

    http
      .get(
        this.context.backendApiUrlPrefix +
          "/rests/data/network-topology:network-topology/topology=cli?content=nonconfig",
        this.context.authToken
      )
      .then((res) => {
        try {
          let topologies = Object.keys(res);
          let topology = Object.keys(res[Object.keys(res)]);
          let topology_id = res[topologies][topology]["topology-id"];
          let nodes = res[topologies][topology]["node"];

          if (nodes) {
            nodes.map((device) => {
              let node_id = device["node-id"];
              return this.addDeviceEntry(node_id, topology_id);
            });
          }
        } catch (e) {
          console.log(e);
        }
      });

    http
      .get(
        this.context.backendApiUrlPrefix +
          "/rests/data/network-topology:network-topology/topology=topology-netconf?content=nonconfig",
        this.context.authToken
      )
      .then((res) => {
        try {
          let topologies = Object.keys(res);
          let topology = Object.keys(res[Object.keys(res)]);
          let topology_id = res[topologies][topology]["topology-id"];
          let nodes = res[topologies][topology]["node"];

          if (nodes) {
            nodes.map((device) => {
              let node_id = device["node-id"];
              return this.addDeviceEntry(node_id, topology_id);
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
    this.search();
  }

  search() {
    let toBeRendered = [];
    let query = this.state.keywords.toUpperCase();
    if (query !== "") {
      const rows = this.state.data;
      for (let i = 0; i < rows.length; i++) {
        for (let y = 0; y < rows[i].length; y++) {
          if (rows[i][y] && rows[i][y].toUpperCase().indexOf(query) !== -1) {
            toBeRendered.push(rows[i]);
            break;
          }
        }
      }
    } else {
      toBeRendered = this.state.data;
    }
    let size = ~~(toBeRendered.length / this.state.defaultPages);
    let pages = toBeRendered.length
      ? toBeRendered.length % this.state.defaultPages
        ? ++size
        : size
      : 0;

    this.setState({
      table: toBeRendered,
      pagesCount: pages
    });
  }

  showMountModal() {
    this.setState({
      mountModal: !this.state.mountModal
    });
  }

  showDetailModal() {
    this.setState({
      detailModal: !this.state.detailModal
    });
  }

  getDeviceObject(node_id, topology) {
    let topology_obj =
      topology === "cli" ? "cli-topology" : "netconf-node-topology";
    return http
      .get(
        this.context.backendApiUrlPrefix +
          "/rests/data/network-topology:network-topology/topology=" +
          topology +
          "/node=" +
          node_id +
          "?content=nonconfig",
        this.context.authToken
      )
      .then((res) => {
        try {
          let device = res.node[0];
          let node_id = device["node-id"];
          let host = device[`${topology_obj}:host`];
          let a_cap = device[`${topology_obj}:available-capabilities`];
          let u_cap =
            device[`${topology_obj}:unavailable-capabilities`] || null;
          let status = device[`${topology_obj}:connection-status`];
          let port = device[`${topology_obj}:port`];
          let err_patterns =
            device[`${topology_obj}:default-error-patterns`] || null;
          let commit_patterns =
            device[`${topology_obj}:default-commit-error-patterns`] || null;
          let connected_message =
            device[`${topology_obj}:connected-message`] || null;

          return http
            .get(
              this.context.backendApiUrlPrefix +
                "/rests/data/network-topology:network-topology/topology=" +
                topology +
                "/node=" +
                node_id +
                "?content=config",
              this.context.authToken
            )
            .then((res) => {
              try {
                let device = res.node[0];
                let transport_type =
                  device[`${topology_obj}:transport-type`] ||
                  device[`${topology_obj}:tcp-only`];
                let protocol = topology_obj.split("-")[0];

                return {
                  node_id: node_id,
                  host: host,
                  a_cap: a_cap,
                  u_cap: u_cap,
                  status: status,
                  port: port,
                  err_patterns: err_patterns,
                  commit_patterns: commit_patterns,
                  topology: topology,
                  transport_type: transport_type,
                  protocol: protocol,
                  connected_message: connected_message,
                };
              } catch (e) {
                console.log(e);
              }
            });
        } catch (e) {
          console.log(e);
        }
      });
  }

  async getDeviceDetails(data) {
    let node_id = data[0];
    let topology = data[3] === "netconf" ? "topology-netconf" : "cli";
    let deviceObject = await this.getDeviceObject(node_id, topology);
    this.setState({
      deviceDetails: deviceObject
    });

    this.showDetailModal();
  }

  sort(data, i) {
    this.state.sort
      ? data.sort((a, b) => {
          let x = a[i].toUpperCase();
          let y = b[i].toUpperCase();
          return x > y ? 1 : y > x ? -1 : 0;
        })
      : data.sort((a, b) => {
          let x = a[i].toUpperCase();
          let y = b[i].toUpperCase();
          return x < y ? 1 : y < x ? -1 : 0;
        });
    return data;
  }

  repeat() {
    let output = [];
    let defaultPages = this.state.defaultPages;
    let viewedPage = this.state.viewedPage;
    let dataset =
      this.state.keywords === "" ? this.state.data : this.state.table;
    dataset = this.sort(dataset, this.state.sortCategory);
    for (let i = 0; i < dataset.length; i++) {
      if (
        i >= (viewedPage - 1) * defaultPages &&
        i < viewedPage * defaultPages
      ) {
        output.push(
          <tr key={`row-${i}`} id={`row-${i}`}>
            <td className="">
              <Form.Check
                type="checkbox"
                onChange={e => this.onDeviceSelect(e, dataset[i], i)}
                id={`chb-${i}`}
              />
            </td>
            <td
              id={`node_id-${i}`}
              onClick={() => this.getDeviceDetails(dataset[i])}
              className={"clickable btn-outline-primary"}
            >
              {dataset[i][0]}
            </td>
            <td>{dataset[i][1]}</td>
            <td
              style={
                dataset[i][2] === "connected"
                  ? { color: "#007bff" }
                  : { color: "lightblue" }
              }
            >
              {dataset[i][2]}
              &nbsp;&nbsp;
              <i
                id={`refreshBtn-${i}`}
                onClick={e => this.onDeviceRefresh(e, dataset[i])}
                style={{ color: "#007bff" }}
                className="fas fa-sync-alt fa-xs clickable"
              />
            </td>
            <td id={`topology-${i}`}>{dataset[i][3]}</td>
            <td>
              <Button
                className="noshadow"
                variant="outline-primary"
                onClick={() => {
                  this.props.history.push(this.context.frontendUrlPrefix + "/devices/edit/" + dataset[i][0]);
                }}
                size="sm"
              >
                <i className="fas fa-cog" />
              </Button>
            </td>
          </tr>
        );
      }
    }
    return output;
  }

  columnSort(i) {
    let dataset =
      this.state.keywords === "" ? this.state.data : this.state.table;
    dataset = this.sort(dataset, i);
    this.setState({
      [this.state.keywords === "" ? "data" : "table"]: dataset,
      sort: !this.state.sort,
      sortCategory: i
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

  render() {
    let mountModal = this.state.mountModal ? (
      <MountModal
        addDeviceEntry={this.addDeviceEntry}
        modalHandler={this.showMountModal}
        show={this.state.mountModal}
        device={this.state.selectedDevices}
      />
    ) : null;
    let detailModal = this.state.detailModal ? (
      <DetailModal
        deviceDetails={this.state.deviceDetails}
        modalHandler={this.showDetailModal}
        show={this.state.detailModal}
      />
    ) : null;

    return (
      <div className="listPage">
        <Container>
          <FormGroup className="deviceGroup leftAligned1">
            <Button
              variant="outline-primary"
              onClick={this.showMountModal.bind(this)}
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Mount Device
            </Button>
            <Button
              variant="outline-danger"
              onClick={this.removeDevices.bind(this)}
            >
              <FontAwesomeIcon icon={faMinusCircle} /> Unmount Devices
            </Button>
          </FormGroup>
          <FormGroup className="deviceGroup rightAligned1">
            <Button
              variant="primary gradientBtn"
              onClick={this.refreshAllDeviceEntries.bind(this)}
            >
              <FontAwesomeIcon icon={faSync} /> Refresh
            </Button>
          </FormGroup>
          <FormGroup className="searchGroup">
            <Form.Control
              value={this.state.keywords}
              onChange={this.onEditSearch}
              placeholder="Search by keyword."
            />
          </FormGroup>

          {mountModal}
          {detailModal}

          <div className="scrollWrapper">
            <Table ref={this.table} striped hover size="sm">
              <thead>
                <tr>
                  <th>Select</th>
                  <th
                    className="tableHeader"
                    onClick={() => this.columnSort(0)}
                  >
                    Node ID
                  </th>
                  <th
                    className="tableHeader"
                    onClick={() => this.columnSort(1)}
                  >
                    IP address
                  </th>
                  <th
                    className="tableHeader"
                    onClick={() => this.columnSort(2)}
                  >
                    Status
                  </th>
                  <th
                    className="tableHeader"
                    onClick={() => this.columnSort(3)}
                  >
                    OS/Version
                  </th>
                  <th>Config</th>
                </tr>
              </thead>
              <tbody>{this.repeat()}</tbody>
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

export default List;
