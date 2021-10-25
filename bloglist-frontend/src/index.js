import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import notificationReducer from './reducer/notificationReducer';
import timerReducer from './reducer/timerReducer';

const combinedReducer=combineReducers({
  notification:notificationReducer,
  timer:timerReducer
});

const store = createStore(combinedReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
