var checkAuth = require('./middleware/express/checkAuth');
var passport = require('./lib/passport');

module.exports = function(app) {
	app.get('/', checkAuth, require('./views/default').get);
	app.get('/login', require('./views/default').get);

	app.post('/login', function(req, res) {
		passport.authenticate('local', function(err, user) {
			if (req.xhr) {
				if (err) {
					return res.json({ error: err.message });
				}
				if (!user) { return res.json({error: 'Invalid Login'}); }
				req.login(user, {}, function(err) {
					if (err) {
						return res.json({error: err});
					}
					res.json({ error: null });
				});
			}
		})(req, res);
	});

	app.get('/login-fb', passport.authenticate('facebook', {scope: 'email'}));
	app.get('/register', require('./views/default').get);
	app.post('/register', require('./views/register').post);

	app.get('/login-fb-callback*',
			passport.authenticate('facebook',
				{
					successRedirect: '/',
					failureRedirect: '/login'
				}
			)
	);

	app.get('/login-vk',
		passport.authenticate('vk', {
			scope: ['email', 'friends']
		}),
		function() {
			// The request will be redirected to vk.com
			// for authentication, so
			// this function will not be called.
		});

	app.get('/login-vk-callback',
		passport.authenticate('vk', {
			successRedirect: '/',
			failureRedirect: '/login'
		}),
		function(req, res) {
			// Successful authentication
			// redirect home.
			res.redirect('/');
		});

	app.get('/logout', checkAuth, require('./views/logout').get);
};
