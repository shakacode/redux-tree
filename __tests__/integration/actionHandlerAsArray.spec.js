import { createStore } from 'redux';
import { Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  it('reduces the state w/ action handlers as an array', () => {
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

          STOP_PROCESSING_ENTITY: [
            // 1. ui leaf
            (state, { entityId }) =>
              state.update(
                'processingEntities',
                processingEntities => processingEntities.delete(entityId),
              ),

            // 2. entity leaf
            {
              leaf: ['entities', 'entityLeaf'],
              reduce:
                (state, { entityId }) =>
                  state.update('index', index => index.delete(entityId)),
            },
          ],
        },
      ),
    });

    const store = createStore(tree);

    const initialState = store.getState();

    store.dispatch({
      type: 'START_PROCESSING_ENTITY',
      entityId: 1,
    });

    const processingState = store.getState();

    store.dispatch({
      type: 'STOP_PROCESSING_ENTITY',
      entityId: 1,
    });

    const processedState = store.getState();

    expect(initialState).toMatchSnapshot('@@INIT');
    expect(processingState).toMatchSnapshot('START_PROCESSING_ENTITY');
    expect(processedState).toMatchSnapshot('STOP_PROCESSING_ENTITY');
  });


  it('throws on undefined state returned form action handler as a function in an array', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          UNDEFINED_STATE: [
            () => undefined,
            {
              leaf: ['entities', 'entityLeaf'],
              reduce: state => state,
            },
          ],
        },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'UNDEFINED_STATE' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });


  it('throws on undefined state returned form action handler as an object in an array', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          UNDEFINED_STATE: [
            state => state,
            {
              leaf: ['entities', 'entityLeaf'],
              reduce: () => undefined,
            },
          ],
        },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'UNDEFINED_STATE' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });


  it('throws on invalid keypath in an object in an array', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          INVALID_KEYPATH: [
            state => state,
            {
              leaf: ['entities', 'invalidLeaf'],
              reduce: state => state,
            },
          ],
        },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'INVALID_KEYPATH' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });
});
