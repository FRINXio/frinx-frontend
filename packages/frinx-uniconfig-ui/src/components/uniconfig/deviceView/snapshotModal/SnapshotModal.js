import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import callbackUtils from '../../../../utils/callbackUtils';

class SnapshotModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      snapshotStatus: 0,
      errorMsg: '',
      device: this.props.device,
      snapshotName: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.setSnapshotName = this.setSnapshotName.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      device: nextProps.device,
    });
  }

  setSnapshotName() {
    let name = document.getElementById('snapshotNameInput').value;
    this.setState({
      snapshotName: name,
    });
  }

  handleClose() {
    this.setState({ show: false });
    this.props.snapHandler();
  }

  handleSave() {
    let name = document.getElementById('snapshotNameInput').value;
    let target = {
      input: {
        name: name,
        'target-nodes': {
          node: [this.state.device],
        },
      },
    };

    const createSnapshot = callbackUtils.createSnapshotCallback();

    createSnapshot(target).then((output) => {
      this.setState({
        snapshotStatus: output['output']['overall-status'],
        errorMsg: output['output']['node-results']
          ? output['output']['node-results']['node-result']['0']['error-message']
          : '',
      });
    });
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header>
          <Modal.Title>Create New Snapshot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="snapshotNameInput">
              <Form.Label>Snapshot Name</Form.Label>
              <Form.Control type="input" placeholder="snapshot1" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p style={{ fontSize: '15px', maxWidth: '50%' }}> {this.state.errorMsg}</p>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button
            variant={
              this.state.snapshotStatus === 'complete'
                ? 'success'
                : this.state.snapshotStatus === 'fail'
                ? 'danger'
                : 'primary'
            }
            onClick={this.handleSave}
          >
            {this.state.snapshotStatus === 'complete' ? <i className="fas fa-check-circle" /> : null}
            &nbsp;&nbsp;
            {this.state.snapshotStatus === 'complete' ? 'Saved' : 'Save Snapshot'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SnapshotModal;
