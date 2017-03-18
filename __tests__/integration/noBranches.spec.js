import { createStore } from 'redux';

import { createTree, createLeaf } from '../../src';

describe('redux-tree', () => {
  it('reduces the state w/ leaf as a direct child of the tree', () => {
    const tree = createTree({
      leaf: createLeaf(0, { INCREMENT: state => state + 1 }),
    });

    const store = createStore(tree);

    const initialState = store.getState();

    store.dispatch({ type: 'INCREMENT' });

    const reducedState = store.getState();

    expect(initialState).toMatchSnapshot('@@INIT');
    expect(reducedState).toMatchSnapshot('INCREMENT');
  });
});
