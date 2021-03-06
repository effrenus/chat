import React, {Component, PropTypes} from 'react';
import './input.sass';

class Input extends Component {
	static propTypes = {
		addMessage: PropTypes.func,
		channel: PropTypes.string,
		activeChannelId: PropTypes.string,
		user: PropTypes.object,
		recordAudioMessage: PropTypes.func
	}

	componentDidMount() {
		this.refs.messageInput.addEventListener('keydown', event => {
			if (event.keyCode === 13) {
				if (event.ctrlKey || event.metaKey) {
					this.insertNewline(event);
				} else {
					this.submitMessage(event);
				}
			}
		});
	}

	insertNewline(event) {
		event.preventDefault();
		event.stopPropagation();

		const elm = this.refs.messageInput;
		const value = elm.value;
		const start = elm.selectionStart;
		elm.value = `${value.slice(0, start)}\n${value.slice(elm.selectionEnd)}`;
		elm.selectionStart = elm.selectionEnd = start + 1;
	}

	submitMessage(event) {
		event.preventDefault();
		event.stopPropagation();

		const elm = this.refs.messageInput;
		const text = elm.value.trim();
		if (text.length > 0) {
			const {addMessage, activeChannelId, user} = this.props;
			addMessage('text', text, activeChannelId, user._id);
			elm.value = '';
		}
	}

	render() {
		return (
			<div className="dialog-input">
				<textarea ref="messageInput" className="dialog-input__textarea"></textarea>
				<a className="dialog-input__add-button" href="#">+</a>
				<i onClick={this.props.recordAudioMessage} className="dialog-input__record-button fa fa-microphone"></i>
			</div>
		);
	}
}

export default Input;
