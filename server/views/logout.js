var manager = require('../socket/manager');

exports.get = function(req, res, next) {
	var sid = req.session.id;
	var uid = req.user._id;

	req.session.destroy(function(err) {
		if (err) {
			return next(err);
		}
		manager.disconnectUser(uid, sid);
		res.redirect('/login');
	});
};
