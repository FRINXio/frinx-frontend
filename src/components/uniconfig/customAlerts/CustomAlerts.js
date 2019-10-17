import React, { Component } from "react";
import { Alert } from "react-bootstrap";

class CustomAlerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  render() {
    const handleDismiss = () => this.props.alertHandler();

    function showAlert(alertType) {
      switch (alertType.type) {
        case "commit200":
          return (
            <Alert variant="success">Commit to network was successful.</Alert>
          );
        case "commit": {
          return (
            <Alert
              onClick={handleDismiss}
              variant={
                alertType.overallStatus === "complete" ? "success" : "danger"
              }
            >
              <b>
                COMMIT-TO-NETWORK {alertType.overallStatus.toUpperCase()}
                :&nbsp;&nbsp;
              </b>
              {alertType.overallStatus === "fail"
                ? alertType.errorMessage
                : alertType.nodeStatus
                ? "Node-status: " + alertType.nodeStatus
                : null}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i className="fas fa-times clickable" onClick={handleDismiss} />
            </Alert>
          );
        }
        case "replacesnap": {
          return (
            <Alert
              onClick={handleDismiss}
              variant={alertType.status === "complete" ? "success" : "danger"}
            >
              <b>REPLACE-CONFIG-WITH-SNAPSHOT:&nbsp;&nbsp;</b>
              {alertType.status}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i className="fas fa-times clickable" onClick={handleDismiss} />
            </Alert>
          );
        }
        case "replaceconf": {
          return (
            <Alert
              onClick={handleDismiss}
              variant={alertType.status === "complete" ? "success" : "danger"}
            >
              <b>REPLACE-CONFIG-WITH-OPERATIONAL:&nbsp;&nbsp;</b>
              {alertType.status}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i className="fas fa-times clickable" onClick={handleDismiss} />
            </Alert>
          );
        }
        case "dryrun": {
          let errorMessage =
            alertType.errorMessage === "Unified Mountpoint not found."
              ? "Dry-run is not supported for this node"
              : alertType.errorMessage;
          return (
            <Alert
              onClick={handleDismiss}
              variant={
                alertType.overallStatus === "complete" ? "success" : "danger"
              }
            >
              <b>
                DRY-RUN {alertType.overallStatus.toUpperCase()}:&nbsp;&nbsp;
              </b>
              {alertType.overallStatus === "fail"
                ? errorMessage
                : alertType.nodeStatus
                ? "Node-status: " + alertType.nodeStatus
                : null}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i className="fas fa-times clickable" onClick={handleDismiss} />
            </Alert>
          );
        }
        case "sync": {
          return (
            <Alert
              onClick={handleDismiss}
              variant={alertType.errorMessage ? "danger" : "success"}
            >
              <b>SYNC-FROM-NETWORK :&nbsp;&nbsp;</b>
              {alertType.errorMessage
                ? alertType.errorMessage
                : alertType.status}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i className="fas fa-times clickable" onClick={handleDismiss} />
            </Alert>
          );
        }
        default:
          return null;
      }
    }

    return this.state.show ? showAlert(this.props.alertType) : null;
  }
}

export default CustomAlerts;
