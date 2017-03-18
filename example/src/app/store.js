import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import tree from './tree';
import DevTools from './DevTools';

// You can test rehydration of the state tree
// Just pass it as a second argument to `createStore`
// See `api/index.js` for details
// import rehydratedState from '../api';


export default createStore(
  tree, // <= `tree` is a root reducer in fact
  compose(
    applyMiddleware(thunkMiddleware),
    DevTools.instrument(),
  ),
);
