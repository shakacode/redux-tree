import { createStore } from 'redux';
import { Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  it('reduces the state w/ action handler as a function', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          START_PROCESSING_ENTITY:
            (state, { entityId }) =>
              state.update(
                'processingEntities',
                processingEntities => processingEntities.add(entityId),
              ),
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


  it('throws on undefined state returned form action handler as a function', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        { UNDEFINED_STATE: () => undefined },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'UNDEFINED_STATE' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });
});
