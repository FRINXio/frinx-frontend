import * as React from "react";
import { PortWidget } from "storm-react-diagrams";

export class JoinNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: 80
        };
    }

    render() {
        return (
            <div className={"join-node"} style={{position: "relative", width: this.state.size, height: this.state.size}}>
                <svg width={this.state.size} height={this.state.size}
                     dangerouslySetInnerHTML={{
                         __html:
                             `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="purple" stroke="#000000" stroke-width="3" stroke-miterlimit="10" points="10,` +
                             this.state.size / 2 +
                             ` ` +
                             this.state.size / 2 +
                             `,10 ` +
                             (this.state.size - 10) +
                             `,` +
                             this.state.size / 2 +
                             ` ` +
                             this.state.size / 2 +
                             `,` +
                             (this.state.size - 10) +
                             ` "/>
                <text x="28" y="45" fill="white" font-size="13px" >join</text>
          </g>
        `
                     }}/>
                <div style={{position: "absolute", zIndex: 10, left: this.state.size / 2 - 8, top: 0}}>
                    <PortWidget name="top" node={this.props.node} />
                </div>
                <div style={{position: "absolute", zIndex: 10, left: this.state.size / 2 - 8, top: this.state.size - 16}}>
                    <PortWidget name="bottom" node={this.props.node} />
                </div>
            </div>
        );
    }
}
