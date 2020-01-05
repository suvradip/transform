/* eslint-disable no-eval */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChartViewer from './chartViewer';
import Editor from './editor';

const HC_LOCAL = 'hcCode';

class MainApp extends Component {
   constructor(props) {
      super(props);

      this.state = {
         hcCode: localStorage.getItem(HC_LOCAL) || '',
         fcCode: '',
      };
   }

   componentDidUpdate(nextProps) {
      const { fcConfiguration } = this.props;
      if (nextProps.fcConfiguration !== fcConfiguration) {
         const finalHTMLContent = `new FusionCharts(${JSON.stringify(
            fcConfiguration
         )}).render(document.getElementById('chart-container'))`;

         eval(finalHTMLContent);

         // eslint-disable-next-line
         this.setState({
            fcCode: finalHTMLContent,
         });
      }
   }

   renderHighCharts = code => {
      if (code) {
         localStorage.setItem(HC_LOCAL, code);
      }

      Highcharts.charts.forEach(chartRef => {
         if (chartRef) chartRef.destroy();
      });

      eval(code);
   };

   renderFusionCharts = code => {
      eval(code);
   };

   render() {
      const { hcCode, fcCode } = this.state;
      const { dispatch } = this.props;

      const styleObj = {
         general: {
            padding: 0,
            margin: 0,
         },
         wrapper: {
            padding: '5px',
            margin: '10px',
         },
         nav: {
            backgroundColor: '#002934',
         },
         img: {
            height: '65px',
            width: 'auto',
         },
      };

      return (
         <div className="container-fluid" style={styleObj.general}>
            <div
               className="mb-5 d-flex justify-content-between align-items-center"
               style={styleObj.nav}
            >
               <img style={styleObj.img} src="/logo.png" alt="brand logo" />
               <a href="/samples/" target="_blank" className="btn btn-outline-info mr-3">
                  Other samples
               </a>
            </div>
            <div style={styleObj.wrapper}>
               <div className="row">
                  <div className="col-6">
                     <ChartViewer containerId="container" />
                     <Editor
                        name="HighCharts"
                        onClickRun={this.renderHighCharts}
                        code={hcCode}
                        dispatch={dispatch}
                     />
                  </div>
                  <div className="col-6">
                     <ChartViewer containerId="chart-container" />
                     <Editor
                        name="FusionCharts"
                        code={fcCode}
                        disableConvert={false}
                        onClickRun={this.renderFusionCharts}
                        dispatch={dispatch}
                     />
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

MainApp.propTypes = {
   fcConfiguration: PropTypes.object,
   dispatch: PropTypes.func.isRequired,
};

MainApp.defaultProps = {
   fcConfiguration: undefined,
};

export default MainApp;
