module.exports = {
	port: process.env.PORT || 3000,
	app: {
		serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
		socketOrigin: process.env.SOCKET_ORIGIN || 'http://localhost:*'
	},
	mongoose: {
		'uri': process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017',
		'options': {
			'server': {
				'socketOptions': {
					'keepAlive': 1
				}
			}
		}
	},
	passport: {
		'facebook': {
			'clientID': process.env.FB_ID || 'test',
			'clientSecret': process.env.FB_SECRET || 'test'
		},
		vk: {
			'app_id': process.env.VK_ID || 'test',
			'secret': process.env.VK_SECRET || 'test'
		}
	},
	session: {
		'secret': 'chatseesion',
		'key': 'sid',
		'cookie': {
			'path': '/',
			'httpOnly': true,
			'maxAge': null
		}
	},
	AVATAR_COLORS: ['31b0c3', 'fdc689', 'f8a232', 'f8a232', 'f6a4c9', '8c6239', '39b54a'],
	AVATAR_IMAGES: ['images/avatar/1.png', 'images/avatar/2.png', 'images/avatar/3.png', 'images/avatar/4.png', 'images/avatar/5.png', 'images/avatar/6.png'],
	DEFAULT_CHANNEL_ID: '1bd3b5a8a7a560e168b3890a',
	STATIC_PATH: '/static'
};
