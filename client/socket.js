import io from 'socket.io-client';
import {dispatch} from './store';
import {addRemoteMessage} from './actions/messages';
import {
	setActiveChannel,
	setOfflineChannel,
	setOnlineChannel,
	addContact, removeFromChannelList, setPrivateToChannel} from './actions/channels';
import {setUserId} from './actions/user';
import {setError} from './actions/ui';

export const STATUS = {
	UNINITIALIZED: 1,
	PENDING: 2,
	CONNECTED: 3,
	DISCONNECTED: 4
};
let connectionStatus = STATUS.UNINITIALIZED;
let socket;

/*
	TODO Move to store (?)
 */
export function bindActionsToSocketEvents() {
	socket.on('s.user.set_user_id', data => { dispatch(setUserId(data)); });
	socket.on('s.user.send_private', data => { dispatch(setPrivateToChannel(data.channel, data.custom.message_count)); });
	socket.on('s.channel.join', data => { dispatch(setActiveChannel(data.channel)); });
	socket.on('s.channel.online', data => { dispatch(setOnlineChannel(data)); });
	socket.on('s.channel.offline', data => { dispatch(setOfflineChannel(data)); });
	socket.on('s.user.send_message', data => { dispatch(addRemoteMessage(data)); });
	socket.on('s.channel.add', data => {
		if (data !== null) {
			dispatch(addContact(data));
		} else {
			dispatch(setError('addChannel'));
		}
	});
	socket.on('s.channel.delete', data => {
		dispatch(removeFromChannelList(data));
	});
}

export function connect() {
	if (connectionStatus === STATUS.UNINITIALIZED) {
		socket = io();
		connectionStatus = STATUS.PENDING;
		return new Promise((resolve, reject) => {
			socket.once('connect', () => {
				connectionStatus = STATUS.CONNECTED;
				bindActionsToSocketEvents();
				resolve(socket);
			});
			setTimeout(() => reject(new Error('Connection timeout')), 10000);
		});
	}

	return Promise.resolve(socket);
}

/**
 * Get socket instance, if connection doesn't established make connection
 * @return {promise} Always return promise
 */
export function getSocket() {
	switch (connectionStatus) {
	case STATUS.CONNECTED:
		return Promise.resolve(socket);
	case STATUS.UNINITIALIZED:
		return connect();
	case STATUS.DISCONNECTED:
		return Promise.reject(new Error('Socket disconnected'));
	default:
		return Promise.reject(new Error('Unresolved socket status'));
	}
}

export function getStatus() {
	return connectionStatus;
}
