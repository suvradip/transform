const { pixelToNumber, sanitizeColorCode } = require('../util/helper');
const Common = require('./common');

class Bubble extends Common {
   constructor(config) {
      super(config);
   }

   get chart() {
      const { yAxis = {}, xAxis = {} } = this.props;
      const xPlotLinesObj = (xAxis.plotLines && xAxis.plotLines[0]) || {};
      const yPlotLinesObj = (yAxis.plotLines && yAxis.plotLines[0]) || {};

      return {
         ...super.chart,
         ...(xPlotLinesObj.value && { drawQuadrant: true }),
         quadrantXVal: xPlotLinesObj.value,
         quadrantYVal: yPlotLinesObj.value,
         quadrantLineThickness: xPlotLinesObj.width || yPlotLinesObj.width,
         quadrantLineColor:
            sanitizeColorCode(xPlotLinesObj.color) || sanitizeColorCode(yPlotLinesObj.color),
         ...((xPlotLinesObj.dashStyle === 'dot' || yPlotLinesObj.dashStyle === 'dot') && {
            quadrantLineDashed: true,
         }),

         /*    ...(xPlotLinesObj.label &&
            xPlotLinesObj.label.x >= 0 && { quadrantLabelBR: xPlotLinesObj.label.text }),
         ...(xPlotLinesObj.label &&
            xPlotLinesObj.label.x < 0 && { quadrantLabelBL: xPlotLinesObj.label.text }),

         ...(yPlotLinesObj.label &&
            yPlotLinesObj.label.y >= 0 && { quadrantLabelTR: yPlotLinesObj.label.text }),
         ...(yPlotLinesObj.label &&
            yPlotLinesObj.label.y < 0 && { quadrantLabelTL: yPlotLinesObj.label.text }), */
      };
   }

   get dataset() {
      const datasetProps = this.props.series;
      return datasetProps.map(item => ({
         ...(item.name && { seriesname: item.name }),
         ...(item.color && { color: sanitizeColorCode(item.color) }),
         data: item.data.map(d => {
            return {
               x: d.x,
               y: d.y,
               z: d.z,
               name: d.name,
            };
         }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'bubble',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: {
               ...this.chart,
               showValues: 1,
            },
            categories: this.categories('bubble'),
            dataset: this.dataset,
         },
      };
   }
}

module.exports = Bubble;
