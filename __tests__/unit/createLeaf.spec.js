import { createLeaf } from '../../src';

describe('createLeaf', () => {
  it('throws on missing initial state', () => {
    expect(() => createLeaf()).toThrowErrorMatchingSnapshot();
  });

  it('throws on invalid reducers', () => {
    const initialState = { initial: 'state' };
    const reducers = [];

    expect(() => createLeaf(initialState, reducers)).toThrowErrorMatchingSnapshot();
  });
});
