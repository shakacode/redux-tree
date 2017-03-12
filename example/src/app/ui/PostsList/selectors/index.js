import { createSelector, createStructuredSelector } from 'reselect';

import { getPostsList } from '../../../entities/posts/selectors';

const getLeafState = state => state.ui.postsList;

const getManagingStatus = createSelector(
  getLeafState,
  state => state.isManaging,
);

const getProcessingPosts = createSelector(
  getLeafState,
  state => state.processingPosts,
);

const getPosts = createSelector(
  getPostsList,
  getProcessingPosts,
  (posts, processingPosts) =>
    posts.map(post => ({
      post,
      isProcessing: processingPosts.includes(post.id),
    })),
);

export default createStructuredSelector({
  posts: getPosts,
  isManaging: getManagingStatus,
});
