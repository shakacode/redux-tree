import { createStore } from 'redux';
import { Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  it('reduces the state w/ action handler as a classic reducer', () => {
    const initialUILeafState = new UILeaf({ processingEntities: new Set() });

    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        (state = initialUILeafState, action) => {
          switch (action.type) {
            case 'START_PROCESSING_ENTITY':
              return state.update(
                'processingEntities',
                processingEntities => processingEntities.add(action.entityId),
              );
            default:
              return state;
          }
        },
      ),
    });

    const store = createStore(tree);

    const initialState = store.getState();

    store.dispatch({
      type: 'START_PROCESSING_ENTITY',
      entityId: 1,
    });

    const reducedState = store.getState();

    expect(initialState).toMatchSnapshot('@@INIT');
    expect(reducedState).toMatchSnapshot('START_PROCESSING_ENTITY');
  });


  it('throws on undefined state returned form action handler as a classic reducer', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(() => undefined),
    });

    expect(() => createStore(tree)).toThrowErrorMatchingSnapshot();
  });
});
