import React, { Component } from "react";
import "../../App.css";

class KibanaFrame extends Component {
  render() {
    return (
      <div>
        <iframe
          width="100%"
          height="900px"
          title="Kibana"
          src={`http://${window.location.hostname}:5601`}
        />
      </div>
    );
  }
}

export default KibanaFrame;
