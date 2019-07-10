import React, {Component} from "react";

export class TrayWidget extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div className="tray">{this.props.children}</div>;
    }
}
