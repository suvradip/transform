require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cacheControl = require('express-cache-controller');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const debug = require('debug')('conversion:index.js');
const Transform = require('./service/transform');

// Initialize App
const app = express();
app.use(logger('dev'));
app.use(cacheControl());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dayInterval = 86400;
const yearInterval = 31536000;

/* general API */
app.post('/api/hc-fc', async (req, res) => {
   const { chartConfig } = req.body;
   if (chartConfig) {
      try {
         debug('configuration received');
         const t = new Transform(chartConfig);
         res.status(200).json(t.chartConfig);
         debug('data transform done and sent.');
      } catch (error) {
         debug(`Error occurred`, error.message);
         res.status(400).send({ msg: 'experience an error' });
      }
   } else {
      res.status(400).send({ msg: 'chart configuration absent' });
   }
});

app.use(
   '/',
   express.static(path.join(__dirname, '../build'), {
      setHeaders: (res, url) => {
         switch (express.static.mime.lookup(url)) {
            case 'text/html':
            case 'application/json':
               res.cacheControl = {
                  noCache: true,
                  maxAge: 0,
               };
               return;
            case 'text/css':
               res.cacheControl = {
                  public: true,
                  maxAge: yearInterval,
               };
               return;
            case 'application/javascript':
               res.cacheControl = {
                  private: true,
                  maxAge: yearInterval,
               };
               return;
            default:
               res.cacheControl = {
                  public: true,
                  maxAge: dayInterval,
               };
         }
      },
   })
);

/*  catch 404 and forward to error handler */
app.use((req, res, next) => {
   const err = new Error('<h1>Not Found</h1>');
   err.status = 404;
   next(err);
});

/* error handler */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.send(err.message);
});

const PORT = process.env.PORT || 8888;
// Starting Server
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
