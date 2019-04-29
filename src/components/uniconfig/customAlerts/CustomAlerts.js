import React, { Component } from 'react';
import { Alert } from "react-bootstrap";


class CustomAlerts extends Component {

    render() {
        function showAlert(alertType) {
            switch (alertType) {
                case 'commit200':
                    return (
                        <Alert variant="success">
                            Commit to network was successful.
                        </Alert>
                    );
                case 'commit500':
                    return (
                        <Alert variant="success">
                            Commit to network failed.
                        </Alert>
                    );
                case 'snapCreated':
                    return (
                        <Alert variant="success">
                            New snapshot was created.
                        </Alert>
                    );
                case 'dryrun200':
                    return (
                        <Alert variant="success">
                            Dry-run was successful.
                        </Alert>
                    );
                case 'dryrun500':
                    return (
                        <Alert variant="success">
                            Dry-run failed.
                        </Alert>
                    );
                default:
                    return null;
            }

        }

        return (
            showAlert(this.props.alertType)
        );
    }
}

export default CustomAlerts;