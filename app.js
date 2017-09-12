const Audiosearch = require('audiosearch-client-node');
const bodyParser = require('body-parser');
const express = require('express');
const secrets = require('./secrets.js');

const app = express();
const audiosearch = new Audiosearch(secrets.AUDIOSEARCH_APP_ID, secrets.AUDIOSEARCH_SECRET);

app
  .set('view engine', 'hjs')
  .use(express.static(__dirname + '/public'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .get('/', (req, res) => {
    res.render('home');
  })
  .post('/search', (req, res) => {
    audiosearch.searchEpisodes(req.body.term).then(function (data) {
      const firstResult = data.results[0];
      res.send(data);
    });
  })
  .listen(3000, () => {
    console.log('Server now listening on port 3000...');
  });
