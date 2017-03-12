import React from 'react';
import { Provider } from 'react-redux';

import store from './store';

import UI from './ui';
import DevTools from './DevTools';

const App = () => (
  <Provider {...{ store }}>
    <div>
      <UI />
      <DevTools />
    </div>
  </Provider>
);

export default App;
