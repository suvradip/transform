/* eslint-disable no-eval */
import React, { Component } from "react";
import ChartViewer from "./chartViewer";
import Editor from "./editor";

const HC_LOCAL = "hcCode";

class MainApp extends Component {
   constructor(props) {
      super(props);

      this.state = {
         hcCode: localStorage.getItem(HC_LOCAL) || "",
         fcCode: ""
      };
   }

   renderHighCharts = code => {
      if (code) {
         localStorage.setItem(HC_LOCAL, code);
      }

      window.Highcharts.charts.forEach(chartRef => {
         if (chartRef) chartRef.destroy();
      });

      eval(code);
   };

   renderFusionCharts(code) {
      eval(code);
   }

   componentDidUpdate(nextProps) {
      const { fcConfiguration } = this.props;
      if (nextProps.fcConfiguration !== fcConfiguration) {
         const finalHTMLContent = `new FusionCharts(${JSON.stringify(
            fcConfiguration
         )}).render(document.getElementById('chart-container'))`;

         eval(finalHTMLContent);

         this.setState({
            fcCode: finalHTMLContent
         });
      }
   }

   render() {
      return (
         <div className="container-fluid">
            <h3 className="mt-2 mb-5">Conversion</h3>
            <div className="row">
               <div className="col-6">
                  <ChartViewer containerId="container" />
                  <Editor
                     name="HighCharts"
                     onClickRun={this.renderHighCharts}
                     code={this.state.hcCode}
                     dispatch={this.props.dispatch}
                  />
               </div>
               <div className="col-6">
                  <ChartViewer containerId="chart-container" />
                  <Editor
                     name="FusionCharts"
                     code={this.state.fcCode}
                     disableConvert={false}
                     onClickRun={this.renderFusionCharts}
                  />
               </div>
            </div>
         </div>
      );
   }
}

export default MainApp;
