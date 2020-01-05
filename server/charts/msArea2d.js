const { pixelToNumber } = require('../util/helper');
const Common = require('./common');

class MsArea2d extends Common {
   constructor(config) {
      super(config);
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'msarea',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: this.chart,
            categories: this.categories('area'),
            dataset: this.dataset,
         },
      };
   }
}

module.exports = MsArea2d;
