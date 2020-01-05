const debug = require('debug')('conversion:service:transform.js');

const MsBar2d = require('../charts/msBar2d');
const MsArea2d = require('../charts/msArea2d');
const MsLine = require('../charts/msLine');
const Pie = require('../charts/pie');
const MsColumn = require('../charts/msColumn');
const HeatMap = require('../charts/heatMap');
const Bubble = require('../charts/bubble');
const Scatter = require('../charts/scatter');

const HcFcMapping = {
   area: MsArea2d,
   bar: MsBar2d,
   bubble: Bubble,
   column: MsColumn,
   heatmap: HeatMap,
   line: MsLine,
   pie: Pie,
   scatter: Scatter,
};

const { stringToObject } = require('../util/helper');

class Transform {
   constructor(config, theme) {
      this.hcConfig = stringToObject(config);
      this.theme = theme || 'fusion';
      this.chartType = (this.hcConfig.chart && this.hcConfig.chart.type) || 'line';

      if (this.chartType === 'column' && this.hcConfig.chart.inverted) {
         this.chartType = 'bar';
      }
      debug(`Highcharts type is ${this.chartType}`);
   }

   get chartConfig() {
      const ChartObj = HcFcMapping[this.chartType];
      if (ChartObj) {
         const instance = new ChartObj({
            fcTheme: this.theme,
            hcConfig: this.hcConfig,
         });

         debug('Transform object ready to ship');
         return instance.chartConfig;
      }

      return 'chart type not supported.';
   }
}

module.exports = Transform;
