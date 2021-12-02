var createError = require('http-errors');
var express = require('express');
var path = require('path');
var multer = require("multer");
const upload = multer({ dest: './ public / uploads' });
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql=require('mysql2');
var session = require('express-session');
var nodemailer = require('nodemailer');
//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signRouter = require('./routes/sign');
var forgetpkRouter=require('./routes/forgetpk');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var verifyRouter = require('./routes/verify/verify');
var createVoteRouter = require('./routes/admin/createvote');
var workConfigRouter=require('./routes/admin/workconfig');
var activityRouter=require('./routes/activity/activity');
var signupoverviewRouter =require('./routes/overview/signup_overview');
var voteoverviewRouter = require('./routes/overview/vote_overview');
var signupRouter =require('./routes/signup/signup');
var voteRouter=require('./routes/vote/vote');
var buyRouter=require('./routes/vote/buy');
//個人專區
var myinfoRouter=require('./routes/personal/myinfo');
var myworkRouter=require('./routes/personal/mywork');
var mycollectionRouter=require('./routes/personal/mycollection');
//var myfavoriteRouter=require('./routes/personal/myfavorite');
var myregistrationRouter=require('./routes/personal/myregistration');
var workuploadRouter=require('./routes/personal/workupload');
var accountconfigRouter=require('./routes/personal/accountconfig');
var app = express();
require('dotenv').config();
/*
var pool=mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DB_PASS,
  database: "user"
})*/
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "user"
})
var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }

});
pool.getConnection(function(err){
  if(err){
    console.log('connection error');
    console.log(err)
    return;
  }
  console.log('connection success');
});
setInterval(function(){
  if (((parseInt(Date.now() / 1000) - 57600) % 86400 >= 0) && ((parseInt(Date.now() / 1000) - 57600) % 86400 <120)) {
    pool.getConnection(function (err, connection) {
      connection.query('UPDATE  member_info SET votecount=0', function (err, rows) {
        if (err) {
          res.render('error', {
            message: err.message,
            error: err
          })
        } else {
          console.log('votecount reset');
        }
      })
      connection.release();
    })
  }
},30000)
//var nowtime = parseInt(Date.now() / 1000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "123456"}));
app.use(function(req,res,next){
  req.connection=pool;
  next();
})

//router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sign',signRouter);
app.use('/forgetpk',forgetpkRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/verify',verifyRouter);
app.use('/createvote',createVoteRouter);
app.use('/workconfig',workConfigRouter);
app.use('/activity',activityRouter);
app.use('/overview_signup',signupoverviewRouter);
app.use('/overview_vote', voteoverviewRouter);
app.use('/signup',signupRouter);
app.use('/vote',voteRouter);
app.use('/buy', buyRouter);
//個人專區
app.use('/myinfo',myinfoRouter);
app.use('/mywork',myworkRouter);
app.use('/mycollection',mycollectionRouter);
app.use('/workupload',workuploadRouter);
//app.use('/myfavorite',myfavoriteRouter);
app.use('/accountconfig',accountconfigRouter);
app.use('/myregistration',myregistrationRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//var http = require('http');
//var formidable = require('formidable');
/*
http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      res.write('File uploaded');
      res.end();
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8000);*/
module.exports = app;
