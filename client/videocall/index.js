/* eslint no-unused-expressions: 0 */
import io from 'socket.io-client';
import {videocall as config} from '../config';
import {getUserMedia} from '../utils/media'; /* eslint no-unused-vars: 0*/
import store from '../store';
import {activateVideoPanel} from '../actions/ui';
import {STREAM_REQUEST_TIMEOUT} from '../config';
import {getSocket} from '../socket';

window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;

const connectionConfig = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};

const videocall = {
	init: function() {
		this.pc = new window.RTCPeerConnection(connectionConfig);
		this.pc.onicecandidate = event => {
			getSocket().then(socket => socket.emit('c.peer_ice', {peerId: videocall.peerId, candidate: event.candidate}));
		};
		this.pc.onaddstream = event => {
			const video = document.createElement('video');
			video.setAttribute('autoplay', true);
			video.setAttribute('muted', true);
			video.src = window.URL.createObjectURL(event.stream);
			document.body.appendChild(video);
		};
		getSocket().then(socket => {
			socket.on('s.peer_call', videocall.handlePeerCall);
			socket.on('s.peer_ice', data => {
				if (!data.candidate) {
					return;
				}
				videocall.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
			});
		});
	},

	handlePeerCall: function(data) {
		const {peerId, session: remoteSession} = data;
		const {pc} = videocall;
		videocall.peerId = peerId;
		videocall
			.requestLocalStream()
			.then(stream => pc.addStream(stream))
			.then(() => {
				pc.setRemoteDescription(new RTCSessionDescription(remoteSession), () => {
					pc.createAnswer(localSession => {
						pc.setLocalDescription(localSession);
						getSocket().then(socket => socket.emit('c.peer_answer', {peerId, localSession}));
					}, error => console.log(error));
				});
			});
	},

	connect: function(peerId) {
		videocall.peerId = peerId;
		return new Promise((resolve, reject) => {
			this.pc.createOffer(localSession => {
				this.pc.setLocalDescription(new RTCSessionDescription(localSession), () => {
					getSocket().then(socket => {
						socket.emit('c.peer_call', {peerId: peerId, session: localSession});
						socket.once('s.peer_answer', data => {
							this.pc.setRemoteDescription(new RTCSessionDescription(data.session), resolve, reject);
						});
					});
				});
			}, error => reject);
		});
	},

	setLocalStream: function(stream) {
		this.localStream = stream;
		this.pc.addStream(stream);
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
				config.media,
				stream => {
					resolve(stream);
				},
				err => {
					reject(`Failed to get local stream: ${err}`);
				}
			);
		});
	},

	stop: function() {
		this.mediaConnection && this.mediaConnection.close();
		this.localStream && this.localStream.getTracks().forEach(track => track.stop());
		this.remoteStream && this.remoteStream.getTracks().forEach(track => track.stop());
		this.localStream = this.remoteStream = null;
	}
};

export default videocall;
