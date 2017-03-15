import { createStore } from 'redux';
import { Set } from 'immutable';

import { createLeaf } from '../../src';
import { EntityLeaf, UILeaf, mockTree } from '../factories';

describe('redux-tree', () => {
  it('throws on invalid action handler', () => {
    const tree = mockTree({
      entityLeaf: createLeaf(new EntityLeaf({ index: new Set([1, 2, 3]) })),
      uiLeaf: createLeaf(
        new UILeaf({ processingEntities: new Set() }),
        { INVALID_ACTION_HANDLER: 'invalid handler' },
      ),
    });

    const store = createStore(tree);

    const badDispatch = () => store.dispatch({ type: 'INVALID_ACTION_HANDLER' });

    expect(badDispatch).toThrowErrorMatchingSnapshot();
  });
});
