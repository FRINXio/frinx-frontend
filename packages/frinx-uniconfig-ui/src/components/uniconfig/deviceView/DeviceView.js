import React, { Component } from 'react';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import Editor from './editor/Editor';
import './DeviceView.css';
import { Badge, Button, ButtonGroup, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import SnapshotModal from './snapshotModal/SnapshotModal';
import CustomAlerts from '../customAlerts/CustomAlerts';
import ConsoleModal from './consoleModal/ConsoleModal';
import { parseResponse } from './ResponseParser';
import callbackUtils from '../../../utils/callbackUtils';

const defaultOptions = {
  originalFileName: 'Operational',
  updatedFileName: 'Operational',
  inputFormat: 'diff',
  outputFormat: 'line-by-line',
  showFiles: false,
  matching: 'none',
  matchWordsThreshold: 0.25,
  matchingMaxComparisons: 2500,
};

class DeviceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: '{}',
      operational: '{}',
      device: null,
      snapshots: ['snapshot1', 'snapshot2'],
      showDiff: false,
      creatingSnap: false,
      syncing: false,
      initializing: true,
      alertType: null,
      showAlert: false,
      commiting: false,
      showConsole: false,
      deletingSnaps: false,
      console: '',
      operation: '',
    };
  }

  componentDidMount() {
    this.fetchData(this.props.deviceId);
  }

  fetchData(device) {
    const getCliConfigurationalDataStore = callbackUtils.getCliConfigurationalDataStoreCallback();
    const getCliOperationalDatastore = callbackUtils.getCliOperationalDataStoreCallback();

    getCliConfigurationalDataStore(device).then((datastore) => {
      this.setState({
        config: JSON.stringify(datastore),
        initializing: false,
      });
    });

    getCliOperationalDatastore(device).then((datastore) => {
      this.setState({
        operational: JSON.stringify(datastore),
        initializing: false,
      });
    });
  }

  updateConfig(newData) {
    let data = JSON.parse(JSON.stringify(newData, null, 2));

    const updateCliConfigurationalDataStore = callbackUtils.updateCliConfigurationalDataStoreCallback();

    updateCliConfigurationalDataStore(this.props.deviceId, data).then((res) => {
      this.setState({
        alertType: `putConfig${res.status}`,
        console: JSON.stringify(res.body, null, 2),
        operation: 'Update Config',
      });
      this.animateConsole();
    });

    this.setState({
      config: JSON.stringify(newData, null, 2),
    });
  }

  showDiff() {
    this.setState({
      showDiff: !this.state.showDiff,
    });
  }

  getCalculatedDiff() {
    let target = {
      input: {
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    const calculateDiff = callbackUtils.calculateDiffCallback();

    calculateDiff(target).then((output) => {
      this.setState({
        console: JSON.stringify(output),
        operation: 'Calculated Diff',
      });
      this.animateConsole();
    });
  }

  commitToNetwork() {
    this.setState({ commiting: true });
    let target = {
      input: {
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    const commitToNetwork = callbackUtils.commitToNetworkCallback();
    const getCliOperationalDataStore = callbackUtils.getCliOperationalDataStoreCallback();

    commitToNetwork(target).then((output) => {
      this.setState({
        alertType: parseResponse('commit', output),
        showAlert: true,
        commiting: false,
        console: JSON.stringify(output),
        operation: 'Commit to Network',
      });
      this.animateConsole();

      getCliOperationalDataStore(this.props.deviceId).then((res) => {
        this.setState({
          operational: JSON.stringify(res),
        });
      });
    });
  }

  dryRun() {
    let target = {
      input: {
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    const dryRunCommit = callbackUtils.dryRunCommitCallback();

    dryRunCommit(target).then((output) => {
      this.setState({
        alertType: parseResponse('dryrun', output),
        showAlert: true,
        console: JSON.stringify(output),
        operation: 'Dry-run',
      });
      this.animateConsole();
      if (!this.state.alertType['errorMessage'] && this.state.console) {
        this.consoleHandler();
      }
    });
  }

  animateConsole() {
    document.getElementById('consoleButton').classList.add('button--animate');
    setTimeout(() => {
      document.getElementById('consoleButton').classList.remove('button--animate');
    }, 500);
  }

  syncFromNetwork() {
    this.setState({ syncing: true });
    let target = {
      input: {
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    const syncFromNetwork = callbackUtils.syncFromNetworkCallback();
    const getCliOperationalDataStore = callbackUtils.getCliOperationalDataStoreCallback();

    syncFromNetwork(target).then((sync_output) => {
      getCliOperationalDataStore(this.props.deviceId).then((output) => {
        console.log(output);
        this.setState({
          alertType: parseResponse('sync', sync_output),
          showAlert: true,
          operational: JSON.stringify(output),
          initializing: false,
          syncing: false,
          console: JSON.stringify(sync_output),
          operation: 'Sync-from-network',
        });
        this.animateConsole();
      });
    });
  }

  refreshConfig() {
    const getCliConfigurationalDataStore = callbackUtils.getCliConfigurationalDataStoreCallback();

    getCliConfigurationalDataStore(this.props.deviceId).then((datastore) => {
      this.setState({
        config: JSON.stringify(datastore),
      });
    });
  }

  replaceConfig() {
    let target = {
      input: {
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    const replaceConfigWithOperational = callbackUtils.replaceConfigWithOperationalCallback();

    replaceConfigWithOperational(target).then((output) => {
      this.refreshConfig();
      this.setState({
        alertType: parseResponse('replaceconf', output),
        showAlert: true,
        console: JSON.stringify(output),
        operation: 'Replace-config-with-operational',
      });
      this.animateConsole();
    });
  }

  getSnapshots() {
    const getSnapshots = callbackUtils.getSnapshotsCallback();

    getSnapshots().then((output) => {
      console.log(output);
      let topologies = ['cli', 'uniconfig', 'topology-netconf', 'unitopo'];
      let snapshots = output['network-topology']['topology'].filter(
        (topology) =>
          topology['node'] &&
          topology['node']['0']['node-id'] === this.props.deviceId &&
          !topologies.includes(topology['topology-id']),
      );
      this.setState({
        snapshots: snapshots,
      });
    });
  }

  loadSnapshot(snapshotId) {
    let snapshotName = this.state.snapshots[snapshotId]['topology-id'];

    const deleteSnapshot = callbackUtils.deleteSnapshotCallback();
    const getSnapshots = callbackUtils.getSnapshots();
    const replaceConfigWithSnapshot = callbackUtils.replaceConfigWithSnapshotCallback();

    // deleting snapshot
    if (this.state.deletingSnaps) {
      let target = { input: { name: snapshotName } };

      return deleteSnapshot(target);
    }

    let target = {
      input: {
        name: snapshotName,
        'target-nodes': { node: [this.props.deviceId.replace(/%20/g, ' ')] },
      },
    };

    replaceConfigWithSnapshot(target).then((output) => {
      getSnapshots().then((snapshots_output) => {
        let snapshot = snapshots_output['network-topology']['topology'].filter(
          (topology) => topology['topology-id'] === snapshotName,
        )[0]?.node[0];

        delete snapshot['node-id'];

        this.setState({
          alertType: parseResponse('replacesnap', output),
          showAlert: true,
          config: JSON.stringify(snapshot, null, 2),
          console: JSON.stringify(output),
          operation: 'Replace-Config-With-Snapshot',
        });
        this.animateConsole();
      });
    });
  }

  createSnapshot() {
    this.setState({
      creatingSnap: !this.state.creatingSnap,
    });
  }

  consoleHandler() {
    this.setState({
      showConsole: !this.state.showConsole,
    });
  }

  alertHandler() {
    this.setState({
      showAlert: !this.state.showAlert,
    });
  }

  render() {
    const DropdownMenu = React.createRef((props, ref) => {
      return <DropdownMenu forwardedRef={ref} />;
    });

    let configJSON = JSON.stringify(JSON.parse(this.state.config), null, 2);
    let operationalJSON = JSON.stringify(JSON.parse(this.state.operational), null, 2);

    const operational = () => (
      <div>
        {this.state.initializing ? (
          <i className="fas fa-sync fa-spin fa-8x" style={{ margin: '40%', color: 'lightblue' }} />
        ) : this.state.showDiff ? (
          <ReactGhLikeDiff options={defaultOptions} past={operationalJSON} current={configJSON} />
        ) : (
          <Editor
            title="Actual Configuration"
            deviceName={this.props.deviceId}
            editable={false}
            syncFromNetwork={this.syncFromNetwork.bind(this)}
            syncing={this.state.syncing}
            inputJSON={operationalJSON}
          />
        )}
      </div>
    );

    const config = () => (
      <div>
        {this.state.initializing ? (
          <i className="fas fa-sync fa-spin fa-8x" style={{ margin: '40%', color: 'lightblue' }} />
        ) : (
          <Editor
            title="Intended Configuration"
            editable={true}
            deviceName={this.props.deviceId}
            updateConfig={this.updateConfig.bind(this)}
            replaceConfig={this.replaceConfig.bind(this)}
            refreshConfig={this.refreshConfig.bind(this)}
            inputJSON={configJSON}
          />
        )}
      </div>
    );

    return (
      <div>
        <header className="options">
          <Button className="round floating-btn noshadow" onClick={this.props.onBackBtnClick} variant="outline-light">
            <i className="fas fa-chevron-left" />
          </Button>
          <Container fluid className="container-props">
            <Row>
              <Col md={5} className="child">
                <Dropdown onClick={this.getSnapshots.bind(this)} className="leftAligned">
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <i className="fas fa-file-download" />
                    &nbsp;&nbsp;Load Snapshot
                  </Dropdown.Toggle>

                  <Dropdown.Menu ref={DropdownMenu}>
                    {this.state.snapshots.map((item, i) => {
                      return (
                        <Dropdown.Item onClick={() => this.loadSnapshot(i)} key={i}>
                          {item['topology-id']}
                          {this.state.deletingSnaps ? <i className="fas fa-minus" style={{ float: 'right' }} /> : null}
                        </Dropdown.Item>
                      );
                    })}
                    <Dropdown.Divider />
                    <Button
                      onClick={() =>
                        this.setState({
                          deletingSnaps: !this.state.deletingSnaps,
                        })
                      }
                      variant={this.state.deletingSnaps ? 'danger' : 'outline-danger'}
                      style={{ marginLeft: '20px', marginRight: '20px' }}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '10px' }} />
                      Toggle deleting
                    </Button>
                  </Dropdown.Menu>
                </Dropdown>
                <Button className="leftAligned" variant="outline-light" onClick={this.createSnapshot.bind(this)}>
                  <i className="fas fa-folder-plus" />
                  &nbsp;&nbsp;Create snapshot
                </Button>
              </Col>
              <Col md={2} className="child">
                <Badge
                  id="consoleButton"
                  className="button--moema clickable button--size-s"
                  onClick={this.consoleHandler.bind(this)}
                >
                  {' '}
                  {this.props.deviceId}
                </Badge>
              </Col>
              <Col md={5} className="child">
                <Form.Group className="rightAligned">
                  <Dropdown as={ButtonGroup}>
                    <Button
                      variant={this.state.showDiff ? 'light' : 'outline-light'}
                      onClick={this.showDiff.bind(this)}
                    >
                      <i className="fas fa-exchange-alt" />
                      &nbsp;&nbsp;
                      {this.state.showDiff ? 'Hide Diff' : 'Show Diff'}
                    </Button>
                    <Dropdown.Toggle split variant="outline-light" id="dropdown-split-basic" />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={this.getCalculatedDiff.bind(this)}>Get calculated diff</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="outline-light" onClick={this.dryRun.bind(this)}>
                    <i className="fas fa-play" />
                    &nbsp;&nbsp;Dry run
                  </Button>
                  <Button variant="outline-light" onClick={this.commitToNetwork.bind(this)}>
                    {this.state.commiting ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <i className="fas fa-network-wired" />
                    )}
                    &nbsp;&nbsp;Commit to network
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </header>

        {this.state.creatingSnap ? (
          <SnapshotModal snapHandler={this.createSnapshot.bind(this)} device={this.props.deviceId} />
        ) : null}
        {this.state.showAlert ? (
          <CustomAlerts alertHandler={this.alertHandler.bind(this)} alertType={this.state.alertType} />
        ) : null}
        {this.state.showConsole ? (
          <ConsoleModal
            consoleHandler={this.consoleHandler.bind(this)}
            content={this.state.console}
            operation={this.state.operation}
          />
        ) : null}

        <Container fluid className="container-props">
          <div className="editor">
            <div className="config">{config()}</div>
            <div className="operational">{operational()}</div>
          </div>
        </Container>
      </div>
    );
  }
}

export default DeviceView;
