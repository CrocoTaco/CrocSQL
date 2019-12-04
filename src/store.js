import devToolsEnhancer from 'remote-redux-devtools';
import {createStore} from 'redux';
import reducers from './reducer/reducers.js';

const store = createStore(reducers, devToolsEnhancer());

export default store;