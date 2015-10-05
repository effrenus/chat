import React, {Component, PropTypes} from 'react';
import UserPic from '../user-pic';
import './userinfo.sass';

class UserInfo extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired
	}


	constructor(props) {
		super(props);
		this.state = {active: false};
	}

	onMouseOver() {
		this.setState({active: true});
	}

	onMouseOut() {
		this.setState({active: false});
	}

	render() {
		const hoverModificator = this.state.active ? 'fa-spin' : '';
		const {user: {avatar, color, username}} = this.props;
		let userName, userAvatar, userColor;

		if (username !== undefined && avatar !== undefined && color !== undefined) {
			userName = username;
			userAvatar = avatar;
			userColor = color;
		}

		return (
		<div className="user-info" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
			<div className="user-info__image">
				<UserPic
					online={true}
					avatar={userAvatar}
					color={userColor}/>
			</div>
			<p className="user-info__greeting">
				Welcome <span className="user-info__name">{userName}</span>
			</p>
			<div className="user-info__icon-settings">
				<i className={'fa fa-cog ' + hoverModificator}></i>
			</div>
		</div>
		);
	}
}

export default UserInfo;
