import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import recorder from '../../audio-record';
import {AUDIO_MESSAGE_DURATION} from '../../config';
import './index.sass';

const state = {
	PREPARE: 1,
	RECORD: 2,
	CONVERT: 3
};

class AudioRecord extends Component {
	static propTypes = {
		addMessage: PropTypes.func,
		stopRecordAudioMessage: PropTypes.func,
		activeChannelId: PropTypes.string,
		userId: PropTypes.string
	}

	constructor() {
		super();
		this.state = {action: state.PREPARE};
	}

	componentDidMount() {
		this.startRecord();
	}

	getMessage() {
		switch (this.state.action) {
		case state.PREPARE:
			return 'Preparing...';
		case state.RECORD:
			return 'Recording...';
		case state.CONVERT:
			return 'Converting...';
		default:
			return '';
		}
	}

	updateTime() {
		const timeElm = React.findDOMNode(this.refs.time);
		const remainTime = AUDIO_MESSAGE_DURATION - ((new Date) - this.startTime);
		timeElm.textContent = `Remain time: ${moment.duration(remainTime).seconds()} second(s)`;
	}

	checkTime() {
		if ((new Date) - this.startTime >= AUDIO_MESSAGE_DURATION) {
			this.stopRecord();
			return;
		}
		this.updateTime();
	}

	clearTimer() {
		clearTimeout(this.timerId);
		this.timerId = null;
	}

	startRecord() {
		recorder.record().then(() => {
			this.startTime = new Date();
			this.timerId = setInterval(this.checkTime.bind(this), 1000);
			this.setState({action: state.RECORD});
		}).catch(() => {
			this.props.stopRecordAudioMessage();
		});
	}

	stopRecord() {
		this.clearTimer();
		this.setState({action: state.CONVERT});
		recorder.stop();
		recorder
			.getMP3()
			.then((blob) => {
				const {addMessage, stopRecordAudioMessage, activeChannelId, userId} = this.props;
				addMessage('audio', blob, activeChannelId, userId);
				stopRecordAudioMessage();
			})
			.catch(() => {
				this.props.stopRecordAudioMessage();
			});
	}

	render() {
		return (
			<div className="audio-record">
				<div className="audio-record__content">
					<i className="audio-record__microphone">
						<i className="fa fa-microphone"></i>
					</i>
					{this.getMessage()}
					{this.state.action === state.RECORD ?
						<button onClick={::this.stopRecord} title="Stop record" className="audio-record__stop fa fa-stop"></button> : ''}
					{this.state.action === state.RECORD ?
						<div ref="time" className="audio-record__time"></div> : ''}
				</div>
			</div>
		);
	}
}

export default AudioRecord;
