import React, { Component } from "react";
import ChartViewer from "./chartViewer";
import Editor from "./editor";

import agent from "../service";

const HC_LOCAL = "hcCode";

class App extends Component {
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

      // eslint-disable-next-line
      eval(code);
   };

   renderFusionCharts(code) {
      // eslint-disable-next-line
      eval(code);
   }

   getChartConfigsAndRender = async () => {
      const { charts } = window.Highcharts;

      charts.forEach(async chartRef => {
         if (chartRef) {
            const chartConfig = JSON.stringify(chartRef.userOptions);
            const data = await agent.post({ chartConfig });
            const finalHTMLContent = `new FusionCharts(${JSON.stringify(
               data
            )}).render(document.getElementById('chart-container'))`;

            // eslint-disable-next-line
            eval(finalHTMLContent);

            this.setState({
               fcCode: finalHTMLContent
            });
         }
      });
   };

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
                     onClickConvert={this.getChartConfigsAndRender}
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

export default App;
