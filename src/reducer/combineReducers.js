// WARNING // THIS FILE IS NOT BEING USED
// Redux is not implemented yet, all methods used on react should have been reducers


import { combineReducers } from 'redux';

// import all reducers here
import Reducers from './reducers';


// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  data: Reducers,
});

// make the combined reducers available for import
export default reducers;
