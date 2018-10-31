const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const Grid = require('gridfs-stream');

const alerts = require('google-alerts-api');

//Passport Config
require('./config/passport')(passport);

const keys = require('./config/keys');
//Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const bot = require('./routes/bot');

mongoose.connect(
  keys.mongoURI,
  {
    useNewUrlParser: true
  }
);
const conn = mongoose.createConnection(
  keys.mongoURI,
  {
    useNewUrlParser: true
  },
  () => {
    console.log('Mongodb Connected');
  }
);

let gfs;
conn.once('open', () => {
  //Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const app = express();

app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;

  next();
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //check if file exist
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType == 'text/csv') {
      //Trigger the bot
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not a textcsv'
      });
    }
  });
});

app.get('/cookie', (req, res) => {
  const cookieJ = JSON.stringify(req.cookies);
  const cookie1 = cookieJ.substring(17, cookieJ.indexOf('}'));
  const cookie = cookie1.substring(1, cookie1.indexOf('"'));

  res.json({ cookieOriginal: req.cookies, cookie });

  console.log(req.cookies);
});

app.use('/auth', auth);
app.use('/', index);
app.use('/bot', bot);

// Handle 404
app.use(function(req, res) {
  return res.render('404');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server running at port 5000');
});
