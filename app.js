var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*var routes = require('./routes/index');
var users = require('./routes/users');
var jcp = require('./routes/jcp');
var envValidatorRouter = require('./routes/env-validator-router');
var prAnalyzerRouter = require('./routes/pr-analyzer-router');
var jiraAppRouter = require('./routes/jira-app-router');
var cacheAppRouter = require('./routes/cache-app/cache-router');
*/
var perfMetricsAppRouter = require('./routes/swa/perf-metrics');

var aisMetricsReports = require('./routes/swa/ais-metrics-reports')
var aisMetricsUploader = require('./routes/swa/ais-metrics-uploader')
var aisSessionReports = require('./routes/swa/ais-session-data-reports')
var aisSessionDataUploader = require('./routes/swa/ais-session-data-uploader')
var aisJira = require('./routes/swa/ais-jira')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/poc', routes);
//app.use('/users', users);
//app.use('/jcp-app', jcp);
//app.use('/env-validator', envValidatorRouter);
//app.use('/pr-analyzer', prAnalyzerRouter);
//app.use('/jira-app', jiraAppRouter);
//app.use('/cache-app', cacheAppRouter);
app.use('/swa/pm', perfMetricsAppRouter);
app.use('/swa/ais/metrics/reports', aisMetricsReports);
app.use('/swa/ais/sessiondata/reports', aisSessionReports);
app.use('/swa/ais/metrics/uploader', aisMetricsUploader);
app.use('/swa/ais/sessiondata/uploader', aisSessionDataUploader);
app.use('/swa/ais/jira', aisJira);

app.get('/swa/ais/metrics', function (req, res) {
  res.render('./swa/ais-metrics-home');
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});*/

app.set('port', 80);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
