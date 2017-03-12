const POST_DELETE_REQUESTED = 'POST_DELETE_REQUESTED';
const POST_DELETE_SUCCEEDED = 'POST_DELETE_SUCCEEDED';

// --- Request

// Action creator
const requestAction = postId => ({
  type: POST_DELETE_REQUESTED,
  postId,
});

// Action handler
const onRequest = {
  [POST_DELETE_REQUESTED]:
    // show spinner
    (state, { postId }) =>
      state.update(
        'processingPosts',
        processingPosts => processingPosts.add(postId),
      ),
};


// --- Success

// Action creator
const successAction = postId => ({
  type: POST_DELETE_SUCCEEDED,
  postId,
});

// Action handlers
const onSuccess = {
  [POST_DELETE_SUCCEEDED]: [
    // 1. hide spinner
    (state, { postId }) =>
      state.update(
        'processingPosts',
        processingPosts => processingPosts.delete(postId),
      ),

    // 2. remove post entity
    {
      leaf: ['entities', 'posts'],
      reduce:
        (state, { postId }) =>
          state
            .updateIn(['index'], index => index.delete(postId))
            .updateIn(['entities'], entities => entities.delete(postId)),
    },
  ],
};


// --- Exports

// Thunk
export const deletePost = postId => dispatch => {
  dispatch(requestAction(postId));
  setTimeout(() => dispatch(successAction(postId)), 1000);
};

// Action handlers
export const onPostDelete = {
  ...onRequest,
  ...onSuccess,
};
