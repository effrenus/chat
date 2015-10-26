import assign from 'object-assign';
import uiActionType, {APP_STATES} from '../constants/ui';

const defaultData = {
	app_state: APP_STATES.LOADING,
	errors: {
		addChannel: false
	},
	videoPanel: {
		active: false
	},
	audioRecord: {
		active: false
	}
};

export function ui(state = defaultData, action) {
	switch (action.type) {

	case uiActionType.SET_ERROR:
		state.errors[action.errorName] = true;
		return assign({}, state);

	case uiActionType.REMOVE_ERROR:
		state.errors[action.errorName] = false;
		return assign({}, state);

	case uiActionType.ACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = true;
		state.videoPanel.localStream = action.localStream;
		state.videoPanel.remoteStream = action.remoteStream;
		return assign({}, state);

	case uiActionType.DEACTIVATE_VIDEO_PANEL:
		state.videoPanel.active = false;
		state.videoPanel.localStream = null;
		state.videoPanel.remoteStream = null;
		return assign({}, state);

	case uiActionType.RECORD_AUDIO_MESSAGE:
		state.audioRecord.active = true;
		return assign({}, state);

	case uiActionType.STOP_RECORD_AUDIO_MESSAGE:
		state.audioRecord.active = false;
		return assign({}, state);

	case uiActionType.UPDATE_APP_STATE:
		return {...state, app_state: action.state};

	default:
		return state;
	}
}
