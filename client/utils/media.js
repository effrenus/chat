window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

export const isUserMediaSupported = !!navigator.getUserMedia;

export const getUserMedia = navigator.getUserMedia;

export const audioContext = new window.AudioContext();

export const parseWav = function(wav) {
	const readInt = (i, bytes) => {
		let ret = 0;
		let shft = 0;

		while (bytes) {
			ret += wav[i] << shft;
			shft += 8;
			i++; /* eslint no-param-reassign: 0 */
			bytes--; /* eslint no-param-reassign: 0 */
		}
		return ret;
	};
	if (readInt(20, 2) !== 1) {
		throw new Error('Invalid compression code, not PCM');
	}
	if (readInt(22, 2) !== 1) {
		throw new Error('Invalid number of channels, not 1');
	}

	return {
		sampleRate: readInt(24, 4),
		bitsPerSample: readInt(34, 2),
		samples: wav.subarray(44)
	};
};
