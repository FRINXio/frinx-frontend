import React, {Component} from "react";

export class TrayItemWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
                }}
                className="tray-item"
            >
                {this.props.name}
            </div>
        );
    }
}