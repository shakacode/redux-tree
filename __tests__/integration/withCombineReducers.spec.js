import { createStore, combineReducers } from 'redux';
import { Record, Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  const rootReducer = combineReducers({
    counter: (state = 0, action) => {
      switch (action.type) {
        case 'INCREMENT_VANILLA_COUNTER':
          return state + 1;
        default:
          return state;
      }
    },
    tree: mockTree({
      entityLeaf: createLeaf(
        new EntityLeaf({ index: new Set() }),
        {
          ADD_ENTITY_TO_TREE:
            (state, { entityId }) =>
              state.update('index', index => index.add(entityId)),
        },
      ),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        {
          START_PROCESSING_TREE_ENTITY:
            (state, { entityId }) =>
              state.update(
                'processingEntities',
                processingEntities => processingEntities.add(entityId),
              ),

          STOP_PROCESSING_TREE_ENTITY: [
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
    }),
  });

  it('initializes empty state on the first dispatch w/o rehydrated state', () => {
    const store = createStore(rootReducer);
    const state = store.getState();

    expect(state.counter).toBe(0);
    expect(state.tree.entities).toBeInstanceOf(Record);
    expect(state.tree.entities.entityLeaf.index).toBeInstanceOf(Set);
    expect(state.tree.ui).toBeInstanceOf(Record);
    expect(state.tree.ui.uiLeaf.processingEntities).toBeInstanceOf(Set);
    expect(state).toMatchSnapshot('@@INIT');
  });


  it('initializes rehydrated state on the first dispatch', () => {
    // rehydrated state
    const State = Record({
      entities: undefined,
      ui: undefined,
    });

    const Entities = Record({
      entityLeaf: undefined,
    });

    const UI = Record({
      uiLeaf: undefined,
    });

    const rehydratedState = {
      counter: 42,
      tree: new State({
        entities: new Entities({
          entityLeaf: { index: new Set([1, 2, 3]) },
        }),
        ui: new UI({
          uiLeaf: { processingEntities: new Set() },
        }),
      }),
    };

    const store = createStore(rootReducer, rehydratedState);
    const state = store.getState();

    expect(state.counter).toBe(42);
    expect(state.tree.entities).toBeInstanceOf(Record);
    expect(state.tree.entities.entityLeaf.index).toBeInstanceOf(Set);
    expect(state.tree.ui).toBeInstanceOf(Record);
    expect(state.tree.ui.uiLeaf.processingEntities).toBeInstanceOf(Set);
    expect(state).toMatchSnapshot('@@INIT_WITH_STATE');
  });


  it('reduces the tree state', () => {
    const store = createStore(rootReducer);

    const initialState = store.getState();

    store.dispatch({
      type: 'ADD_ENTITY_TO_TREE',
      entityId: 1,
    });

    const stateWithEntity = store.getState();

    store.dispatch({
      type: 'START_PROCESSING_TREE_ENTITY',
      entityId: 1,
    });

    const stateWithProcessingEntity = store.getState();

    store.dispatch({
      type: 'STOP_PROCESSING_TREE_ENTITY',
      entityId: 1,
    });

    const stateWithoutEntity = store.getState();

    expect(initialState).toMatchSnapshot('@@INIT_TREE');
    expect(stateWithEntity).toMatchSnapshot('ADD_ENTITY_TO_TREE');
    expect(stateWithProcessingEntity).toMatchSnapshot('START_PROCESSING_TREE_ENTITY');
    expect(stateWithoutEntity).toMatchSnapshot('STOP_PROCESSING_TREE_ENTITY');
  });


  it('reduces vanilla counter state', () => {
    const store = createStore(rootReducer);

    store.dispatch({ type: 'INCREMENT_VANILLA_COUNTER' });

    const state = store.getState();

    expect(state).toMatchSnapshot('INCREMENT_VANILLA_COUNTER');
  });
});
