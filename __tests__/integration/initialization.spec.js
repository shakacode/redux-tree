import { createStore } from 'redux';
import { Record, Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  const tree = mockTree({
    entityLeaf: createLeaf(new EntityLeaf({ index: new Set() })),
    uiLeaf: createLeaf(new UILeaf({ processingEntities: new Set() })),
  });

  it('initializes empty state on the first dispatch w/o rehydrated state', () => {
    const store = createStore(tree);
    const state = store.getState();

    expect(state).toBeInstanceOf(Record);
    expect(state.entities).toBeInstanceOf(Record);
    expect(state.entities.entityLeaf.index).toBeInstanceOf(Set);
    expect(state.ui).toBeInstanceOf(Record);
    expect(state.ui.uiLeaf.processingEntities).toBeInstanceOf(Set);
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

    const rehydratedState = new State({
      entities: new Entities({
        entityLeaf: { index: new Set([1, 2, 3]) },
      }),
      ui: new UI({
        uiLeaf: { processingEntities: new Set() },
      }),
    });

    const store = createStore(tree, rehydratedState);
    const state = store.getState();

    expect(state).toBeInstanceOf(Record);
    expect(state.entities).toBeInstanceOf(Record);
    expect(state.entities.entityLeaf.index).toBeInstanceOf(Set);
    expect(state.ui).toBeInstanceOf(Record);
    expect(state.ui.uiLeaf.processingEntities).toBeInstanceOf(Set);
    expect(state).toMatchSnapshot('@@INIT_WITH_STATE');
  });
});
