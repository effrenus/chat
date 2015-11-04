var inherit = require('inherit');
var manager = require('../manager');

var WebRTC = inherit({
	/**
	 * @param {Object} socket.
	 * @param {Object} Users.
	 */
	__constructor: function(socket) {
		var userId = socket.handshake.user._id;
		this._socket = socket;
		this._user = manager.users.getById(userId);
		this._session = socket.handshake.session;
		this.bindSocketEvents();
	},
	_handlers: [
		{
			name: 'c.peer_call',
			callback: function(data) {
				var peer = manager.users.getById(data.peerId);
				peer.sockets.forEach(socket => socket.emit('s.peer_call', {peerId: this._user.userData._id, session: data.session}));
			}
		},
		{
			name: 'c.peer_answer',
			callback: function(data) {
				var peer = manager.users.getById(data.peerId);
				peer.sockets.forEach(socket => socket.emit('s.peer_answer', {session: data.localSession}));
			}
		},
		{
			name: 'c.peer_ice',
			callback: function(data) {
				var peer = manager.users.getById(data.peerId);
				peer.sockets.forEach(socket => socket.emit('s.peer_ice', {candidate: data.candidate}));
			}
		}
	],
	bindSocketEvents: function() {
		this._handlers.forEach(handler => {
			this._socket.on(handler.name, handler.callback.bind(this));
		});
	}
});


module.exports = WebRTC;
