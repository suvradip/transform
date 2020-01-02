import React from "react";
import "./style.scss";

const ChartViewer = props => (
   <div className="chart-wrapper">
      <div id={props.containerId} className="chart-container text-center"></div>
   </div>
);

export default ChartViewer;
