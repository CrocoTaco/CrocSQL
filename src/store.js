import devToolsEnhancer from 'remote-redux-devtools';
import { createStore } from 'redux';
import reducers from './reducer/reducers';

const store = createStore(reducers, devToolsEnhancer());

export default store;
