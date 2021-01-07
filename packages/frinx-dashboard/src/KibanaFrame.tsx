import React from "react";

const KibanaFrame = () => {
  return (
    <div>
      <iframe
        width="100%"
        height="900px"
        title="Kibana"
        src={`${window.location.protocol}//${window.location.hostname}:5601`}
      />
    </div>
  );
};

export default KibanaFrame;
