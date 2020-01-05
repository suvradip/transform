const { pixelToNumber } = require('../util/helper');
const Common = require('./common');

class MsBar2d extends Common {
   constructor(config) {
      super(config);
   }

   get data() {
      const { series } = this.props;
      return series[0].data.map(item => ({
         ...(item.name && { label: item.name }),
         ...(item.y && { value: item.y }),
         ...(item.sliced && { isSliced: item.sliced }),
      }));
   }

   get chartConfig() {
      const { chart = {} } = this.props;
      return {
         type: 'pie2d',
         width: pixelToNumber(chart.width) || '100%',
         height: pixelToNumber(chart.height) || '100%',
         dataFormat: 'json',
         dataSource: {
            chart: this.chart,
            data: this.data,
         },
      };
   }
}

module.exports = MsBar2d;
