import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import UserPic from '../user-pic';
import './dialog-message.sass';

class DialogMessage extends Component {
	static propTypes = {
		user: PropTypes.object,
		message: PropTypes.object,
		channels: PropTypes.object,
		short: PropTypes.bool
	}

	renderShort() {
		return (
			<div className="dialog-message__content">
				<p className="dialog-message__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				<time className="dialog-message__time">13:13</time>
			</div>
		);
	}

	renderFull() {
		const {channels, message, user} = this.props;
		let userName = message.userId;
		if ( channels.contacts[message.channelId] !== undefined && message.channelId !== 'Lobby' ) {
			if ( user._id === message.userId ) {
				userName = 'me';
			} else {
				userName = channels.contacts[message.channelId].name;
			}
		}

		return (
			<div className="dialog-message">
				<UserPic />
				<div className="dialog-message__content">
					<p className="dialog-message__sender">{userName}</p>
					<p className="dialog-message__text">{message.message}</p>
					<time className="dialog-message__time">{moment(message.created).format('MMM Do YYYY, h:mm')}</time>
				</div>
			</div>
		);
	}

	render() {
		const message = this.props.short ? this.renderShort() : this.renderFull();
		const cls = 'dialog-message dialog-message--' + ((this.props.short) ? 'short' : 'long');
		return (
			<li className={cls}>
				{message}
			</li>
		);
	}
}

export default DialogMessage;
