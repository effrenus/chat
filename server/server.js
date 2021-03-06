var http = require('http');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var errorhandler = require('errorhandler');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../webpack.config.js');
var log = require('./lib/log')(module);
var config = require('./config');
var passport = require('./lib/passport');
var HttpError = require('./error').HttpError;
var isDeveloping = process.env.NODE_ENV !== 'production';
var app = express();
require('./lib/database/mongoose');

app.set('main_path', __dirname + path.sep);
app.set('view engine', 'jade');
app.set('views', __dirname + path.sep + 'templates');
app.set('env', process.env.NODE_ENV || 'production');

app.use(morgan(isDeveloping ? 'dev' : 'tiny'));

app.use('/static', express.static(path.resolve(__dirname, '../static')));

if (isDeveloping) {
	const compiler = webpack(webpackConfig);

	app.use(webpackMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		contentBase: 'client',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
	}));

	app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	resave: false,
	cookie: config.get('session:cookie'),
	store: require('./lib/database/sessionStore'),
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./middleware/express/loadUser'));
app.use(compression());

require('./routes')(app);

app.use(require('./middleware/express/sendHttpError'));
app.use(function httpErrorHandler(err, req, res, next) {
	var error = err;
	if (typeof error === 'number') {
		error = new HttpError(error);
	}

	if (error.name === 'MongoError') {
		error = new HttpError(403, error.message);
		res.sendHttpError(error);
	}

	if (error instanceof HttpError) {
		res.sendHttpError(error);
	} else {
		if (app.get('env') === 'develop') {
			errorhandler()(error, req, res, next);
		} else {
			log.error(error);
			error = new HttpError(500);
			res.sendHttpError(error);
		}
	}
});

const server = http.createServer(app);
server.listen(process.env.PORT || config.get('port'), () => log.info('Express server listening on port ' + config.get('port')));

app.use('/peer', require('peer').ExpressPeerServer(server, {debug: isDeveloping})); /* eslint new-cap: 0 */

const io = require('./socket').socket(server);
app.set('io', io);
