import { createSelector } from 'reselect';

const getLeafState = state => state.entities.posts;

export const getPostsList = createSelector(
  getLeafState,
  state =>
    state
      .get('index')
      .map(postId => state.getIn(['entities', postId]))
      .toList()
);
