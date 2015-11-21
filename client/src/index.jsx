import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {compose, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {persistState} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DevTools from './containers/DevTools';
import io from 'socket.io-client';
import reducer from './reducer';
import {setState} from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/App';
import {VotingContainer} from './components/Voting';
import {ResultsContainer} from './components/Results';

const socket = io(`${location.protocol}//${location.hostname}:8090`);

const finalCreateStore = compose(
    applyMiddleware(remoteActionMiddleware(socket)),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const store = finalCreateStore(reducer);
socket.on('state', state =>
    store.dispatch(setState(state))
);

const routes = <Route component={App}>
    <Route path="/results" component={ResultsContainer} />
    <Route path="/" component={VotingContainer} />
</Route>

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router>{routes}</Router>
            <DevTools />
        </div>
    </Provider>,
    document.getElementById('app')
);
