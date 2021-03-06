import React, {Component, PropTypes} from 'react';
import {updateProfile} from '../../actions/user';
import UserPic from '../user-pic';
import './index.sass';

class UserInfoForm extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired,
		modifyInfoDisable: PropTypes.func
	}

	constructor() {
		super();
		this.state = {error: null, user: {}};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			user: {
				_id: nextProps.user._id,
				username: nextProps.user.username,
				email: nextProps.user.email,
				avatar: nextProps.user.avatar,
				color: nextProps.user.color,
				edit: nextProps.user.edit
			}
		});
	}

	onSubmit(event) {
		event.preventDefault();
		this.props.dispatch(updateProfile(this.state.user));
	}

	handleChange(event) {
		const retObject = this.state;
		retObject.user[event.target.name] = event.target.value;
		this.setState(retObject);
	}

	renderInput(name, value, id) {
		let input = <input className="changeinfo-form__radio-input" type="radio" onChange={this.handleChange.bind(this)} name={name} value={value} id={id}/>;
		let style;

		if (name === 'avatar') {
			style = {
				background: "url('" + value + "')" + ' 50%',
				backgroundSize: '30px'
			};
		} else {
			style = {
				background: '#' + value
			};
		}
		if (this.state.user[name] === value) {
			input = <input className="changeinfo-form__radio-input" type="radio" onChange={this.handleChange.bind(this)} name={name} value={value} id={id} checked/>;
		}
		return (
			<label key={`${name}-${id}`} className={'changeinfo-form__item-label changeinfo-form__item-label--' + [name]} htmlFor={id}>
				{input}
				<div className={'changeinfo-form__item changeinfo-form__item--' + [name]} style={style}/>
			</label>
		);
	}

	renderError() {
		return (
			<div className="changeinfo-form__error">{this.state.error}</div>
		);
	}

	render() {
		const colors = ['31b0c3', 'fdc689', 'f8a232', 'ee4a23', 'f6a4c9', '8c6239', '39b54a'];
		const avatars = ['/static/images/avatar/1.png', '/static/images/avatar/2.png', '/static/images/avatar/3.png',
										 '/static/images/avatar/4.png', '/static/images/avatar/5.png', '/static/images/avatar/6.png', '/static/images/avatar/7.png'];
		const userAvatar = [];
		const userColors = [];

		avatars.forEach((avatar, i) => userAvatar.push(this.renderInput('avatar', avatar, `avatar-${i}`)));
		colors.forEach((color, i) => userAvatar.push(this.renderInput('color', color, `color-${i}`)));

		return (
			<div className="changeinfo-form__wrap">
				<form className={'changeinfo-form' + (this.props.user.edit ? ' changeinfo-form--active' : '')} ref="form" onSubmit={::this.onSubmit} action="." method="POST">
					{this.state.error ? this.renderError() : ''}
					<span onClick={this.props.modifyInfoDisable} className="changeinfo-form__close">Close</span>
					<UserPic
						avatar={this.props.user.avatar}
						color={this.props.user.color} />
					<div className="changeinfo-form__content">
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Profile picture:</p>
							<div className="changeinfo-form__field-item">
								{userAvatar}
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Profile color:</p>
							<div className="changeinfo-form__field-item">
								{userColors}
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Username:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="username" type="text" name="username" onChange={this.handleChange.bind(this)} value={this.state.user.username}/>
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Mail:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="email" type="text" name="email" onChange={this.handleChange.bind(this)} value={this.state.user.email}/>
							</div>
						</div>
						<div className="changeinfo-form__field">
							<p className="changeinfo-form__field-title">Password:</p>
							<div className="changeinfo-form__field-item">
								<input className="changeinfo-form__input" ref="password" type="password" name="password" onChange={this.handleChange.bind(this)} placeholder="******"/>
							</div>
						</div>
						<button className="changeinfo-form__submit" type="submit">Save</button>
					</div>
				</form>
			</div>
		);
	}
}

export default UserInfoForm;
