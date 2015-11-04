import {updateAppState} from './ui';
import userActionType from '../constants/user';
import videocall from '../videocall';
import * as transport from '../socket';
import {APP_STATES} from '../constants/ui';

export function setUserData(user, contacts) {
	return {
		type: userActionType.SET_USER_DATA,
		user,
		contacts
	};
}

export function updateUserData(user) {
	return {
		type: userActionType.UPDATE_USER_DATA,
		user
	};
}

export function setUserId(id) {
	return {
		type: userActionType.SET_ID,
		id
	};
}

export function toggleEditable(val) {
	return {
		type: userActionType.SET_EDITABLE,
		val
	};
}

export function updateProfile(dataSend) {
	return dispatch => {
		transport.getSocket().then(socket => {
			socket.on('s.user.update_data', function socketUpdateDataHandler(data) {
				dispatch(toggleEditable(false));
				dispatch(updateUserData(data));
			});
			socket.emit('c.user.update_data', dataSend);
		});
	};
}

export function fetchUserData() {
	return dispatch => {
		transport.getSocket().then(socket => {
			socket.once('s.user.set_data', function socketSetDataHandler({data, contacts}) {
				dispatch(setUserData(data, contacts));
				setTimeout(() => dispatch(updateAppState(APP_STATES.DATA_LOADED)), 1000);
				videocall.init(data._id);
			});
			socket.emit('c.user.get_data');
		});
	};
}
