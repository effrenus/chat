import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addMessage, fetchChannelMessages} from '../../actions/messages';
import Dialog from '../dialog';
import Input from '../input';
import './main.sass';

@connect(store => ({
	messages: store.messages,
	channels: store.channels,
	user: store.user
}))

class Main extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		channels: PropTypes.object,
		messages: PropTypes.object,
		user: PropTypes.object
	}

	render() {
		const {dispatch, user, channels, messages} = this.props;
		const boundActions = bindActionCreators({addMessage}, dispatch);

		return (
			<main className="main">
				<Dialog
						user={user}
						channels={channels}
						messages={messages}
						{...bindActionCreators({fetchChannelMessages}, dispatch)} />
				<Input
						activeChannelId={this.props.channels.current}
						user={user}
						{...boundActions} />
			</main>
		);
	}
}

export default Main;
