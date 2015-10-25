import Peer from 'peerjs';
import {getUserMedia} from '../utils/media'; /* eslint no-unused-vars: 0*/
import store from '../store';
import {activateVideoPanel} from '../actions/ui';
import {STREAM_REQUEST_TIMEOUT} from '../config';

const userMedia = {
	audio: {
		mandatory: {
			echoCancellation: true
		}
	},
	video: {
		mandatory: {
			maxWidth: 340,
			maxHeight: 200
		}
	}
};

const videoStream =  {
	init: function(userId) {
		const {hostname, port} = window.location;
		this.userId = userId;
		this.peer = new Peer(userId, {host: hostname, port: port, path: '/peer'});
		this.bindHandlers();
	},

	getLocalVideo: function() {
		return this.localVideo;
	},

	getRemoteVideo: function() {
		return this.getRemoteVideo;
	},

	requestLocalStream: function() {
		return new Promise((resolve, reject) => {
			navigator.getUserMedia(
				userMedia,
				stream => {
					this.localStream = stream;
					resolve(stream);
				},
				err => {
					reject(`Failed to get local stream: ${err}`);
				}
			);
		});
	},

	requestRemoteStream: function(contactId, localStream) {
		return new Promise((resolve, reject) => {
			const call = this.peer.call(contactId, localStream);
			call.on('close', () => console.log('media close'));
			call.on('error', () => console.log('media error'));
			call.on('stream', remoteStream => {
				this.remoteStream = remoteStream;
				this.mediaConnection = call;
				resolve([localStream, remoteStream]);
			});
			setTimeout(() => reject('Stream request timeout'), STREAM_REQUEST_TIMEOUT);
		});
	},

	_onStreamRequest: function(call) {
		this
			.requestLocalStream()
			.then(localStream => {
				call.answer(localStream);
				call.on('close', () => console.log('media close'));
				call.on('error', () => console.log('media error'));
				call.on('stream', remoteStream => {
					this.remoteStream = remoteStream;
					this.mediaConnection = call;
					store.dispatch(activateVideoPanel(localStream, remoteStream));
				});
			})
			.catch(error => console.log(error));
	},

	bindHandlers: function() {
		const peer = this.peer;
		peer.on('call', this._onStreamRequest.bind(this));
		peer.on('error', error => console.log('Peer error: ', error));
	},

	stop: function() {
		this.mediaConnection && this.mediaConnection.close();
		this.localStream && this.localStream.getTracks().forEach(track => track.stop());
		this.remoteStream && this.remoteStream.getTracks().forEach(track => track.stop());
		this.localStream = this.remoteStream = null;
	}
};

export default videoStream;
