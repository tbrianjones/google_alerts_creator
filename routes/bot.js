const express = require('express');
const router = express.Router();
const request = require('request');

const { create_alerts } = require('../bot/alert');

router.get('/:file/:pass', async (req, res) => {
  await request(
    {
      uri: `https://safe-ridge-41160.herokuapp.com/files/${req.params.file}`
    },
    function(error, response, body) {
      const GMAIL_USERNAME = req.user.email;
      const GMAIL_PASSWORD = req.params.pass;

      const csv = require('csvtojson');

      csv()
        .fromString(body)
        .then(jsonObj => {
          console.log(jsonObj);

          const alert_words = jsonObj.map(x => x['Name']).filter(x => {
            if (x) {
              return true;
            } else {
              return false;
            }
          });
          console.log(alert_words);

          const username = GMAIL_USERNAME;
          const password = GMAIL_PASSWORD;
          if (alert_words.length > 0) {
            create_alerts(username, password, alert_words);
          }
        });
    }
  );

  res.render('message');
});

module.exports = router;
