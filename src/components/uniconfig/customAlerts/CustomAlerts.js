import React, { Component } from 'react';
import { Alert } from "react-bootstrap";


class CustomAlerts extends Component {
    constructor(props, context) {
        super(props, context);

    }

    componentDidMount() {
        console.log(this.props)
    }

    render() {
        function showAlert(alertType) {
            switch (alertType) {
                case 'commitSuccess':
                    return (
                        <Alert variant="success">
                            Commit to network was successful.
                        </Alert>
                    );
                case 'snapCreated':
                    return (
                        <Alert variant="success">
                            New snapshot was created.
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