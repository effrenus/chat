import React, {Component, PropTypes} from 'react';
import './index.sass';

class AudioMessage extends Component {
	static propTypes = {
		blob: PropTypes.object
	}

	constructor() {
		super();
		this.state = {playing: false};
	}

	play() {
		if (this.audio) {
			this.audio.play();
			this.setState({playing: true});
			return;
		}

		const blob = new Blob([this.props.blob], {type: 'audio/mp3'});
		const reader = new FileReader();
		reader.onload = event => {
			this.audio = new Audio(event.target.result);
			this.audio.play();
			this.setState({playing: true});
		};
		reader.readAsDataURL(blob);
	}

	stop() {
		this.audio.pause();
		this.setState({playing: false});
	}

	toggle() {
		if (this.state.playing) {
			this.stop();
		} else {
			this.play();
		}
	}

	render() {
		return (
			<div className="audio-message">
				<button onClick={::this.toggle}  className="audio-message__button">
					<i className="fa fa-music"></i> {this.state.playing ? 'Stop' : 'Play'}
				</button>
			</div>
		);
	}
}

export default AudioMessage;
