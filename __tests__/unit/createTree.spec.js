import { createTree } from '../../src';

describe('createTree', () => {
  it('throws on invalid state', () => {
    const children = { dummyLeaf: v => v };
    const tree = createTree(children);

    const invalidState = {};
    const action = { type: 'ACTION_TYPE' };

    expect(() => tree(invalidState, action)).toThrowErrorMatchingSnapshot();
  });
});
