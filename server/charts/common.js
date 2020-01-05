const { pixelToNumber, sanitizeColorCode } = require('../util/helper');

function extractNumber(param, prefix) {
   const num = Number(param);
   if (param instanceof Array) {
      return {
         [`${prefix}TopMargin`]: param[0] || 0,
         [`${prefix}RightMargin`]: param[1] || 0,
         [`${prefix}BottomMargin`]: param[2] || 0,
         [`${prefix}LeftMargin`]: param[3] || 0,
      };
   }
   return typeof num === 'number'
      ? {
           [`${prefix}TopMargin`]: num,
           [`${prefix}RightMargin`]: num,
           [`${prefix}BottomMargin`]: num,
           [`${prefix}LeftMargin`]: num,
        }
      : num;
}

class Common {
   constructor(config) {
      this.props = config.hcConfig;
      this.theme = config.fcTheme;
   }

   get chart() {
      const {
         chart = {},
         title = {},
         subtitle = {},
         legend = {},
         yAxis = {},
         xAxis = {},
      } = this.props;
      return {
         /* caption properties */
         ...(title.text && { caption: title.text }),
         ...(title.align && { captionAlignment: title.align }),
         ...(title.style && {
            captionFont: title.style.fontFamily,
            captionFontSize: pixelToNumber(title.style.fontSize),
            captionFontColor: title.style.color,
            captionFontBold: title.style.fontWeight,
            captionPadding: title.style.padding,
         }),

         /* subcaption properties */
         ...(subtitle.text && { subcaption: subtitle.text }),
         ...(subtitle.style && {
            subCaptionFont: subtitle.style.fontFamily,
            subCaptionFontSize: pixelToNumber(subtitle.style.fontSize),
            subCaptionFontColor: subtitle.style.color,
            subCaptionFontBold: subtitle.style.fontWeight,
            subCaptionPadding: subtitle.style.padding,
         }),

         /* chart cosmetics */
         ...(chart.borderColor && { borderColor: chart.borderColor }),
         ...(chart.backgroundColor && { bgColor: chart.backgroundColor }),
         ...(chart.borderWidth && { borderThickness: pixelToNumber(chart.borderWidth) }),
         ...(chart.plotBorderColor && { plotBorderColor: chart.plotBorderColor }),
         ...(chart.plotBorderThickness && { plotBorderThickness: chart.plotBorderWidth }),
         ...(chart.plotBackgroundColor && { plotFillColor: chart.plotBackgroundColor }),
         ...(chart.shadow && { showShadow: chart.shadow }),
         ...(chart.style && {
            baseFont: chart.style.fontFamily,
            baseFontSize: pixelToNumber(chart.style.fontSize),
            baseFontColor: chart.style.color,
         }),

         /* Chart Padding & Margins */
         ...(chart.margin && extractNumber(chart.margin, 'chart')),
         ...(chart.marginTop && { chartTopMargin: chart.marginTop }),
         ...(chart.marginRight && { chartRightMargin: chart.marginRight }),
         ...(chart.marginBottom && { chartBottomMargin: chart.marginBottom }),
         ...(chart.marginLeft && { chartLeftMargin: chart.marginLeft }),
         ...(chart.spacing && extractNumber(chart.spacing, 'canvas')),
         ...(chart.spacingTop && { canvasTopMargin: chart.spacingTop }),
         ...(chart.spacingRight && { canvasRightMargin: chart.spacingRight }),
         ...(chart.spacingBottom && { canvasBottomMargin: chart.spacingBottom }),
         ...(chart.spacingLeft && { canvasLeftMargin: chart.spacingLeft }),

         /* legend  properties */
         ...(typeof legend.enabled !== 'undefined' && !legend.enabled && { showLegend: false }),
         ...(legend.align && { legendCaptionAlignment: legend.align }),
         ...(legend.title && { legendCaption: legend.title.text }),
         ...(legend.title &&
            legend.title.style && {
               legendCaptionFont: legend.title.style.fontFamily,
               legendCaptionFontSize: pixelToNumber(legend.title.style.fontSize),
               legendCaptionFontColor: legend.title.style.color,
               legendCaptionFontBold: legend.title.style.fontWeight,
            }),
         ...(legend.backgroundColor && { legendBgColor: legend.backgroundColor }),
         ...(legend.borderColor && { legendBorderColor: legend.borderColor }),
         ...(legend.borderWidth && { legendBorderThickness: legend.borderWidth }),
         ...(legend.style && {
            legendItemFont: legend.style.fontFamily,
            legendItemFontSize: pixelToNumber(legend.style.fontSize),
            legendItemFontColor: legend.style.color,
            legendItemFontBold: legend.style.fontWeight,
         }),
         ...(legend.rtl && { reverseLegend: legend.rtl }),
         ...(legend.verticalAlign && {
            legendPosition: legend.verticalAlign === 'RIGHT' ? 'RIGHT' : 'BOTTOM',
         }),

         /* axis cosmetics */
         ...(yAxis.title && { yAxisname: yAxis.title.text }),
         ...(yAxis.reversed && { rotatexAxisLabels: true, slantLabel: 1 }),

         ...(xAxis.title && { xAxisname: xAxis.title.text }),

         theme: this.theme,
      };
   }

   categories(type = 'line') {
      if (this.props.xAxis && this.props.xAxis.categories) {
         const { categories } = this.props.xAxis;
         return [{ category: categories.map(item => ({ label: item })) }];
      }

      let pointStart;
      if (this.props.plotOptions && this.props.plotOptions.series) {
         const { series } = this.props.plotOptions;
         pointStart = series.pointStart || 0;
      }

      if (
         this.props.plotOptions &&
         this.props.plotOptions[type] &&
         this.props.plotOptions[type].pointStart
      ) {
         pointStart = this.props.plotOptions[type].pointStart || pointStart || 0;
      }

      const totalDataPoint = this.props.series[0].data.length;
      const category = [];
      for (let i = 0; i < totalDataPoint; i += 1) {
         category.push({
            label: pointStart ? (pointStart + i).toString() : '',
         });
      }

      return [{ category }];
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
}

module.exports = Common;
