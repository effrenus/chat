import {audioContext} from '../utils/media';
import * as recordWorker from './record_worker';

const audioStreamOpts = {
	audio: true
};

class AudioRecorder {
	constructor() {
		this.isRecording = false;
		this.timer = null;
		this.recorder = new Worker('/static/js/workers/recorder.js');
	}

	requestAudioStream() {
		return new Promise((resolve, reject) => {
			navigator.getUserMedia(
				audioStreamOpts,
				stream => {
					resolve(stream);
				},
				err => {
					reject(err);
				}
			);
		});
	}

	getRawAudio() {
		return recordWorker.exportWAV();
	}

	getMP3() {
		return recordWorker
			.exportWAV()
			.then(recordWorker.convertToMP3);
	}

	stop() {
		this.isRecording = false;
		this.source.disconnect();
		this.node.disconnect();
		this.stream.getTracks().forEach(track => track.stop());
		this.stream = null;
	}

	onAudioProcess(event) {
		if (!this.isRecording) {
			return;
		}
		recordWorker.record([event.inputBuffer.getChannelData(0)]);
	}

	initAudio(stream) {
		this.stream = stream;
		this.source = audioContext.createMediaStreamSource(stream);
		this.context = this.source.context;

		return recordWorker
			.init({
				sampleRate: this.context.sampleRate,
				numChannels: 1
			})
			.then(() => {
				this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, 0, 1, 1);
				this.node.onaudioprocess = this.onAudioProcess.bind(this);
				this.source.connect(this.node);
				this.node.connect(this.context.destination);
				this.isRecording = true;
			});
	}

	record() {
		return this
				.requestAudioStream()
				.then(this.initAudio.bind(this));
	}
}

export default new AudioRecorder();
