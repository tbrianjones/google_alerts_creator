const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const keys = require('../config/keys');
const passport = require('passport');

const { ensureAuthentication } = require('./ensureAuthentication');

router.get('/', (req, res) => {
  res.render('index/welcome');
});

const storage = new GridFsStorage({
  url: keys.mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

router.get('/dashboard', ensureAuthentication, (req, res) => {
  res.render('dashboard');
});

router.get('/check', (req, res) => {
  console.log(req.isAuthenticated());
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.redirect(`/bot/${req.file.filename}/${req.body.password}`);
});

module.exports = router;
