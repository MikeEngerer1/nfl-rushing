const express = require('express'),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      moment = require('moment-timezone'),
      https = require('https'),
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

app.get('/rushing', (req, res) => {
  return Rushing.list({}).then(rushing => {
    // remove irrelevent/internal fields
    rushing = rushing.map(rush => {
      delete rush.id;
      delete rush.created_at;
      delete rush.updated_at;
      return rush;
    });

    const headers = Object.keys(rushing[0]);

    const rows = rushing.reduce((rows, obj) => {
        let row = [];
        for (let field in obj) {
          const value = obj[field];
          row.push(value);
        }
        rows.push(row);
        return rows;
      },[]);
    
    const data = {headers, rows}
    return res.render('pages/rushing', {data});
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log(`HTTP server listening on port ${process.env.PORT}`)
});