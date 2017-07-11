var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var consolidate = require('consolidate');
var bodyParser = require('body-parser');
var index = require('./server/routes/index');

// 
var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.js');

var compiler = webpack(webpackDevConfig);

// attach to the compiler & the server
app.use(webpackDevMiddleware(compiler, {

  // public path should be the same with webpack config
  publicPath: webpackDevConfig.output.publicPath,
  noInfo: true,
  stats: {
      colors: true
  }
}));
app.use(webpackHotMiddleware(compiler));
// 设置模板文件目录
app.engine('html', consolidate.ejs);
app.set('views', './client/dist');
app.set('view engine', 'html');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('keyboard cat'));
app.use(session({
    resave: true ,
    secret: '123456' , 
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*10,
    }
}));
// app.use('/', function(req, res, next){
//     console.log('app middleware: ', req.session)
//     if(req.session.user){
//       req._user = req.session.user;
//     }
//     next();
// });
app.use('/', index);

// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });

var reload = require('reload');
var http = require('http');

var server = http.createServer(app);
reload(server, app);

server.listen(3000, function(){
    console.log('App (dev) is now running on port 3000!');
});
