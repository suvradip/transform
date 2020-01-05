const { pixelToNumber, sanitizeColorCode } = require('../util/helper');
const Common = require('./common');

class MsColumn extends Common {
   constructor(config) {
      super(config);
   }

   get dataset() {
      const { series } = this.props;
      return series.map(item => ({
         ...(item.name && { seriesname: item.name }),
         ...(item.color && { color: sanitizeColorCode(item.color) }),
         ...(item.data && {
            data: item.data.map(dataItem => {
               if (
                  dataItem instanceof Object &&
                  !(dataItem instanceof Array) &&
                  (typeof dataItem !== 'string' || typeof dataItem !== 'number')
               ) {
                  return { value: dataItem.y };
               }
               return { value: dataItem };
            }),
         }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'mscolumn2d',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: this.chart,
            categories: this.categories('column'),
            dataset: this.dataset,
         },
      };
   }
}

module.exports = MsColumn;
