const express = require('express'),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      moment = require('moment-timezone'),
      https = require('https'),
      json2csv = require('json2csv'),
      morgan = require('morgan');

require('dotenv').config();
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('[:remote-addr] [:date[clf]] [:method :url]', {immediate: true}));
app.use(express.static('public'));

const Rushing = require('./models/rushing');
const { knex } = require('./db/db_instance');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/rushing/:name', (req, res) => {
  const { name } = req.query;
  if (name && typeof name === 'string') {
    return res.render({})
  }
})
app.get('/rushing', (req, res) => {
  const { csv, player } = req.query;
  const opts = {}
  if (player) opts.Player = player; 
  return Rushing.list(opts).then(rushingData => {
    if (!rushingData || !rushingData.length) {
      const templateData = {status: 422, error: 'unprocessable entity', message: 'no data found for given query', data: null}
      return res.render('pages/error', {templateData});
    }
    rushingData = rushingData.map(player => {
      delete player.id;
      delete player.created_at;
      delete player.updated_at;
      return player
    })
    // if user requests a csv download, send the file rather than rendering the page
    if (csv) {
      // const /**/
    } else {
      const templateData = Rushing.format('html-table', rushingData);
      return res.render('pages/rushing', {templateData});
    }
  })
  .catch(err => {
    console.log(err);
    const templateData = {status: 500, error: err,  message: 'error while processing request data', data: null};
    return res.render('pages/error', {templateData})
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log(`HTTP server listening on port ${process.env.PORT}`)
});