export const YANDEX_TRANSLATE_API_KEY = 'trnsl.1.1.20150914T130843Z.938cec0dd1759eb0.bdf30ecc0a54ff8dc94d01b07d5308d63f128e65';

export const defaultChannelId = '1bd3b5a8a7a560e168b3890a';

export const STREAM_REQUEST_TIMEOUT = 5000;

export const AUDIO_MESSAGE_DURATION = 30000;

export const videocall = {
	media: {
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
	}
};
