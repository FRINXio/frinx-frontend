import * as React from "react";
import { PortWidget } from "storm-react-diagrams";

export class DecisionNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: 80
        };
    }

    render() {
        return (
            <div className={"decision-node"} style={{position: "relative", width: this.state.size, height: this.state.size}}>
                <svg width={this.state.size} height={this.state.size}
                     dangerouslySetInnerHTML={{
                         __html:
                             `
          <g id="Layer_1">
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
                <text x="20" y="45" fill="white" font-size="13px" >decide</text>
                <text x="55" y="15" fill="red" font-size="13px" >0</text>
                <text x="55" y="73" fill="chartreuse" font-size="13px" >1</text>
          </g>
           <g id="Layer_2">
          </g>
        `
                     }}/>

                <div style={{position: "absolute", zIndex: 10, top: this.state.size / 2 - 8}}>
                    <PortWidget name="inputPort" node={this.props.node} />
                </div>

                <div style={{position: "absolute", zIndex: 10, left: this.state.size - 16, top: this.state.size / 2 - 8}}>
                    <PortWidget name="neutralPort" node={this.props.node} />
                </div>

                <div style={{position: "absolute", zIndex: 10, left: this.state.size / 2 - 8, top: this.state.size - 16}}>
                    <PortWidget name="completePort" node={this.props.node} />
                </div>

                <div style={{position: "absolute", zIndex: 10, left: this.state.size / 2 - 8, top: 0}}>
                    <PortWidget name="failPort" node={this.props.node} />
                </div>

            </div>
        );
    }
}
