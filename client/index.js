import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Router, Route} from 'react-router';
import store from './store';
import App from './App';
import Login from './components/login';
import Register from './components/register';
import WelcomePage from './components/welcome-page';

ReactDOM.render(
	(
		<Provider store={store}>
			<Router history={createBrowserHistory()}>
				<Route path="/" component={App} />
				<Route component={WelcomePage}>
					<Route path="login" component={Login} />
					<Route path="register" component={Register} />
				</Route>
			</Router>
		</Provider>
	),
	document.getElementById('app'));
