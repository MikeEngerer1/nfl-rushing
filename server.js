// import ENV variables
require('dotenv').config();

// import required dependencies
const express = require('express'),
      bodyParser = require('body-parser'),
      moment = require('moment-timezone'),
      https = require('https'),
      { Parser } = require('json2csv'),
      morgan = require('morgan');

// import db instance
const { knex } = require('./db/db_instance');

// import required models
const Rushing = require('./models/rushing');

// initialize the app
const app = express();

// apply middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('[:remote-addr] [:date[clf]] [:method :url]', {immediate: true}));
app.use(express.static('public'));

// given a set of optional query params, either render the NFL Rushing Statistics page or send a CSV file 
app.get('/rushing', (req, res) => {
  let { csv, Player, limit, offset } = req.query;
  // parse string -> number; set default if not provided
  limit = limit ? parseInt(limit) : 100;
  offset = offset ? parseInt(offset) : 0;
  // maximum 100 rows per request
  if (limit > 100) {
    // configure error info & render error page
    const templateData = {status: 422, error: 'unprocessable entity', message: 'given limit is too large', data: {development: process.env.ENV === 'development'}}
    return res.status(422).render('pages/error', {templateData});
  }
  const opts = {}
  if (Player) opts.Player = Player; 
  // fetch all rushing data, count for given options
  const rushingFetch = Rushing.list(opts, limit, offset),
        rushingCountFetch = Rushing.listCount(opts); 
  return Promise.all([rushingFetch, rushingCountFetch]).then(([rushingData, count]) => {
    if (!rushingData || !rushingData.length) {
      // configure error info & render error page
      const templateData = {status: 422, error: 'unprocessable entity', message: 'no data found for given query', data: {development: process.env.ENV === 'development'}}
      return res.status(422).render('pages/error', {templateData});
    }
    // if user requests a csv download, send the file
    // otherwise render the page
    if (csv) {
      try {
        const { fields, rows } = Rushing.format('csv', rushingData);
        const parser = new Parser({fields});
        const csv = parser.parse(rows);
        return res.attachment('rushing.csv').send(csv);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      const templateData = Rushing.format('html-table', rushingData);
      templateData.meta = {
        Player, // queried player
        count, // total count
        offset, // current offset
        limit, // current limit
        start: offset + 1, // displayed start of range
        end: offset + limit < count ? offset + limit : count, // displayed end of range
        previousPageOffset: offset - limit >= 0 ? offset - limit : null, // offset for previous page
        nextPageOffset: offset + limit < count ? offset + limit : null // offset for next page 
      }
      return res.render('pages/rushing', {templateData});
    }
  })
  .catch(err => {
    console.error('GET /rushing:', err);
    // configure error info & render error page
    const templateData = {status: 500, error: err,  message: 'error while processing request', data: {development: process.env.ENV === 'development'}}
    return res.status(500).render('pages/error', {templateData});
  })
})

// start the app on given PORT
const server = app.listen(process.env.PORT, () => console.log(`HTTP server listening on port ${process.env.PORT}`));