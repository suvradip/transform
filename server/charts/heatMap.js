const { pixelToNumber, sanitizeColorCode } = require('../util/helper');
const Common = require('./common');

class HeatMap extends Common {
   constructor(config) {
      super(config);
   }

   get colorRange() {
      const { colorAxis = {} } = this.props;
      return {
         ...(colorAxis.minColor && { code: colorAxis.minColor }),
         ...(colorAxis.min && { minValue: colorAxis.min }),
         gradient: true,
      };
   }

   get dataset() {
      const datasetProps = super.dataset;
      const cols = this.props.xAxis.categories;
      const rows = this.props.yAxis.categories;

      return datasetProps.map(item => ({
         ...(item.name && { seriesname: item.name }),
         ...(item.color && { color: sanitizeColorCode(item.color) }),
         data: item.data.map(d => {
            const [col, row, value] = d.value;
            return {
               rowid: rows[row],
               columnid: cols[col],
               value,
            };
         }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'heatmap',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: {
               ...this.chart,
               showValues: 1,
            },
            dataset: this.dataset,
            colorRange: this.colorRange,
         },
      };
   }
}

module.exports = HeatMap;
