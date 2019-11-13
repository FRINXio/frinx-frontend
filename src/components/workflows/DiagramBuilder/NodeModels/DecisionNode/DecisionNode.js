import * as React from "react";
import { PortWidget } from "storm-react-diagrams";

export class DecisionNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 100
    };
  }

  render() {
    return (
      <div
        className={"decision-node"}
        style={{
          position: "relative",
          width: this.state.size,
          height: this.state.size
        }}
      >
        <svg
          width={this.state.size + 50}
          height={this.state.size + 5}
          style={{ position: "absolute" }}
          dangerouslySetInnerHTML={{
            __html: `
    
                <text x="30" y="55" fill="white" font-size="13px" >decide</text>
                <text x="0" y="10" fill="lightblue" font-size="13px" >if ${this
                  .props.node.extras.inputs.caseValueParam +
                  " = " +
                  Object.keys(
                    this.props.node.extras.inputs.decisionCases
                  )[0]}</text>
                <text x="95" y="40" fill="white" font-size="13px" >else</text>
                <text x="0" y="98" fill="lightgreen" font-size="13px" >if ${this
                  .props.node.extras.inputs.caseValueParam +
                  " = " +
                  Object.keys(this.props.node.extras.inputs.decisionCases)[1]}
                </text>
        `
          }}
        />
        <svg
          width={this.state.size}
          height={this.state.size}
          dangerouslySetInnerHTML={{
            __html:
              `
          <g id="Layer_1">
            <polygon fill="${this.props.node.color}" stroke="#000000" stroke-width="3" stroke-miterlimit="10" points="10,` +
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
          </g>
           <g id="Layer_2">
          </g>
        `
          }}
        />

        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: this.state.size / 2 - 12
          }}
        >
          <PortWidget name="inputPort" node={this.props.node} />
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: this.state.size - 25,
            top: this.state.size / 2 - 12
          }}
        >
          <PortWidget name="neutralPort" node={this.props.node} />
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: this.state.size / 2 - 12,
            top: this.state.size - 25
          }}
        >
          <PortWidget name="completePort" node={this.props.node} />
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: this.state.size / 2 - 12,
            top: 0
          }}
        >
          <PortWidget name="failPort" node={this.props.node} />
        </div>
      </div>
    );
  }
}
