(() => {
   function postRequest(url, payload) {
      const xHttp = new XMLHttpRequest();
      return new Promise((resolve, reject) => {
         xHttp.open("POST", url, true);
         xHttp.setRequestHeader("Content-type", "application/json");
         // eslint-disable-next-line func-names
         xHttp.addEventListener("load", function() {
            if (this.readyState === 4 && this.status === 200) {
               const configurations = JSON.parse(this.responseText);
               resolve(configurations);
            } else {
               reject(new Error(""));
            }
         });

         xHttp.send(JSON.stringify(payload));
      });
   }

   const libPath =
      "https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.js";
   const libTheme =
      "https://cdn.fusioncharts.com/fusioncharts/latest/themes/fusioncharts.theme.fusion.js";
   class Conversion {
      constructor({ lib, api } = {}) {
         this.replaceCharts = true;
         this.endPoint =
            api || "https://fc-conversion.herokuapp.com/api/hc-fc/";
         this.libPath = lib || libPath;
         this.fcTheme = libTheme;
         this.libStacks = {};
      }

      attachLib({ src, position = "body" } = {}) {
         return new Promise(resolve => {
            if (!this.libStacks.src) {
               const script = document.createElement("script");
               script.src = src;
               script.type = "text/javascript";
               document[position].appendChild(script);
               this.libStacks[src] = true;
               script.onload = () => resolve();
            }
         });
      }

      async renderCharts(config, container) {
         postRequest(this.endPoint, { chartConfig: config })
            .then(data => {
               FusionCharts.ready(() => {
                  new FusionCharts({
                     ...data
                  }).render(container);
               });
            })
            .catch(e => console.error(e));
      }

      parseCharts() {
         const { charts } = Highcharts;
         if (charts) {
            charts.forEach(chartRef => {
               const chartConfig = JSON.stringify(chartRef.userOptions);
               const containerId = chartRef.renderTo.id;
               chartRef.destroy();
               setTimeout(
                  () =>
                     this.renderCharts(
                        chartConfig,
                        document.getElementById(containerId)
                     ),
                  1000
               );
            });
         }
      }

      async init() {
         if (Highcharts && typeof Highcharts !== "undefined") {
            await this.attachLib({ src: this.libPath });
            await this.attachLib({ src: this.fcTheme });
            this.parseCharts();
         }
      }
   }

   new Conversion().init();

   // (() => {
   //    const script = document.createElement('script');
   //    script.src = 'https://s3.amazonaws.com/static.cdn.fusioncharts.com/conversion.js';
   //    script.async = false;
   //    script.type = 'text/javascript';
   //    document.body.appendChild(script);
   // })();
})();
