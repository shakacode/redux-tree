import { createStore } from 'redux';
import { Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  it('reduces the state w/ action handler as an object', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          REMOVE_ENTITY: {
            leaf: ['entities', 'entityLeaf'],
            reduce:
              (state, { entityId }) =>
                state.update('index', index => index.delete(entityId)),
          },
        },
      ),
    });

    const store = createStore(tree);

    const initialState = store.getState();

    store.dispatch({
      type: 'REMOVE_ENTITY',
      entityId: 1,
    });

    const reducedState = store.getState();

    expect(initialState).toMatchSnapshot('@@INIT');
    expect(reducedState).toMatchSnapshot('REMOVE_ENTITY');
  });


  it('throws on undefined state returned form action handler as an object', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          UNDEFINED_STATE: {
            leaf: ['entities', 'entityLeaf'],
            reduce: () => undefined,
          },
        },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'UNDEFINED_STATE' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });


  it('throws on invalid keypath', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          INVALID_KEYPATH: {
            leaf: ['entities', 'invalidLeaf'],
            reduce: state => state,
          },
        },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'INVALID_KEYPATH' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });
});
