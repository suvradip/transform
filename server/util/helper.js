const self = {
   /**
    * To get number value from a string. if string is "10px" then return 10
    */
   pixelToNumber: str => {
      if (str && typeof str !== 'undefined' && String(str).endsWith('px'))
         return Number(String(str).slice(this, -2));
      return str;
   },

   /**
    * if it is a string then convert it to object and return
    */
   stringToObject: param => {
      let obj;
      if (typeof param === 'string') {
         obj = JSON.parse(param);
      } else {
         obj = { ...param };
      }
      return obj;
   },

   rgbToHex: (r, g, b) => {
      function convert(code) {
         let hex = Number(code).toString(16);
         if (hex.length < 2) {
            hex = `0${hex}`;
         }
         return hex;
      }

      const red = convert(r);
      const green = convert(g);
      const blue = convert(b);
      return red + green + blue;
   },

   sanitizeColorCode(code) {
      if (code.startsWith('rgba')) return self.rgbToHex(...code.slice(5, -1).split(','));
      if (code.startsWith('rgb')) return self.rgbToHex(...code.slice(4, -1).split(','));
      return code;
   },
};

module.exports = self;
