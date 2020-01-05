const { pixelToNumber, sanitizeColorCode } = require('../util/helper');
const Common = require('./common');

class Scatter extends Common {
   constructor(config) {
      super(config);
   }

   get dataset() {
      const datasetProps = this.props.series;
      return datasetProps.map(item => ({
         ...(item.name && { seriesname: item.name }),
         ...(item.color && { color: sanitizeColorCode(item.color) }),
         data: item.data.map(d => {
            if (
               d instanceof Object &&
               !(d instanceof Array) &&
               (typeof d !== 'string' || typeof d !== 'number')
            ) {
               return {
                  x: d.x,
                  y: d.y,
                  z: d.z,
               };
            }
            const [x, y] = d;
            return {
               x,
               y,
            };
         }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'zoomscatter',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: this.chart,
            dataset: this.dataset,
         },
      };
   }
}

module.exports = Scatter;
