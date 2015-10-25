import {parseWav} from '../utils/media';
import encoderUrl from 'file!./workers/convert_to_mp3';
import recorderUrl from 'file!./workers/recorder';

export const worker = new Worker(recorderUrl);

export const encoderWorker = new Worker(encoderUrl);

export const uint8ArrayToFloat32Array = function(u8a) {
	const f32Buffer = new Float32Array(u8a.length);
	for (let i = 0; i < u8a.length; i++) {
		let value = u8a[i << 1] + (u8a[(i << 1) + 1] << 8);
		if (value >= 0x8000) value |= ~0x7FFF;
		f32Buffer[i] = value / 0x8000;
	}
	return f32Buffer;
};

export const init = function(config) {
	return new Promise(resolve => {
		worker.addEventListener('message', function eventHandler(event) {
			if (!event.data || !event.data.type) {
				return;
			}
			if (event.data.type === 'event' && event.data.name === 'inited') {
				resolve();
				worker.removeEventListener(eventHandler);
			}
		});
		worker.postMessage({
			command: 'init',
			config
		});
	});
};


export const exportWAV = function(type) {
	return new Promise(resolve => {
		worker.addEventListener('message', function eventHandler(event) {
			if (!event.data || !event.data.type) {
				return;
			}
			if (event.data.type === 'audiodata') {
				resolve(event.data.data);
				worker.removeEventListener(eventHandler);
			}
		});
		worker.postMessage({
			command: 'exportWAV',
			type: type || 'audio/wav'
		});
	});
};

export const record = function(data) {
	worker.postMessage({
		command: 'record',
		buffer: data
	});
};

export const convertToMP3 = function(audiodata) {
	return new Promise(resolve => {
		let arrayBuffer;
		const fileReader = new FileReader();

		fileReader.onload = function() {
			arrayBuffer = this.result;
			const buffer = new Uint8Array(arrayBuffer);
			const	data = parseWav(buffer);

			encoderWorker.postMessage({
				cmd: 'init',
				config: {
					mode: 3,
					channels: 1,
					samplerate: data.sampleRate,
					bitrate: data.bitsPerSample
				}
			});

			encoderWorker.postMessage({
				cmd: 'encode',
				buf: uint8ArrayToFloat32Array(data.samples)
			});

			encoderWorker.postMessage({
				cmd: 'finish'
			});

			encoderWorker.onmessage = function(e) {
				if (e.data.cmd === 'data') {
					const mp3Blob = new Blob([new Uint8Array(e.data.buf)], {
						type: 'audio/mp3'
					});
					resolve(mp3Blob);
				}
			};
		};

		fileReader.readAsArrayBuffer(audiodata);
	});
};
