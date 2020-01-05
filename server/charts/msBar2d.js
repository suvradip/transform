/* eslint-disable max-classes-per-file */

const { pixelToNumber, sanitizeColorCode } = require('../util/helper');
const Common = require('./common');

class MsBar2d extends Common {
   constructor(config) {
      super(config);
      this.extractCategory = false;
   }

   get categories() {
      if (this.extractCategory) {
         const { series } = this.props;
         return series.map(item => ({
            category: item.data.map(dataItem => ({
               label: dataItem[0],
            })),
         }));
      }
      return super.categories('bar');
   }

   get dataset() {
      const { series } = this.props;
      return series.map(item => ({
         ...(item.name && { seriesname: item.name }),
         ...(item.color && { color: sanitizeColorCode(item.color) }),
         ...(item.data && {
            data: item.data.map(dataItem => {
               if (dataItem instanceof Array) {
                  this.extractCategory = true;
                  return { value: dataItem[1] };
               }
               return { value: dataItem };
            }),
         }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'msbar2d',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: this.chart,
            dataset: this.dataset,
            categories: this.categories,
         },
      };
   }
}

module.exports = MsBar2d;
