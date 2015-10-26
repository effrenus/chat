import React, {Component} from 'react';
import {connect} from 'react-redux';
import transport from './socket';
import store from './store';
import Sidebar from './components/sidebar';
import Main from './components/main';
import {fetchUserData} from './actions/user';
import {APP_STATES} from './constants/ui';

import './styles/page.sass';

@connect(store => ({
	ui: store.ui
}))

export default class App extends Component {
	componentWillMount() {
		transport.init();
		store.dispatch(fetchUserData());
	}

	renderUI() {
		return (
			<div className="chat">
				<Sidebar />
				<Main />
			</div>
		);
	}

	render() {
		const {ui} = this.props;
		return ui.app_state === APP_STATES.LOADING ?
					<div className="splash"></div> : this.renderUI();
	}
}
