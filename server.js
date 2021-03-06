
var express = require('express')
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var passport = require('passport')
var csrf = require('csurf')
var app = express()
var session = require('express-session')
var Sequelize = require('sequelize');
var MySQLStore = require('express-mysql-session')(session)

//Database connection and models.
var connection = require('./app/DatabaseInitializer.js')(Sequelize);
var models = require('./app/ModelInitializer.js')(connection, Sequelize);

//Example Data
/*models.ExampleModel.upsert({
  exampleString: "Heyoooo",
  exampleBlob: "Hiyaaaaaa"
})*/



app.use(bodyParser.json())

//http://www.codingscripts.com/using-database-to-handle-session-in-node-js/
var sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'skeleton_db',
    checkExpirationInterval: 1 * 60 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    createDatabaseTable: true,
    connectionLimit: 1
})

app.use(session({
    key: 'session_cookie_name',
    secret: 'strongsecretcodehere', 
    store: sessionStore,
    saveUninitialized: false, // don't create session until something stored,
    resave: false // don't save session if unmodified
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(compression())

var csrfProtection = csrf()
app.use(csrfProtection)

require('./app/Passport.js')(passport, models);

require('./app/APIInitializer.js')(app, models, passport, csrfProtection);

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'public')));

  // send all requests to index.html so browserHistory works
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  if(isDeveloping)
  {
    console.log('Development Express server running at localhost:' + PORT)
  } else{
    console.log('Production Express server running at localhost:' + PORT)
  }
})

