import { createBranch } from '../../../../lib/redux-tree.cjs';

/**
 * @desc `state.entities` branch
 *
 */

import postsLeaf from './posts/leaf';
// import commentsLeaf from './comments/leaf';

export default createBranch({
  posts: postsLeaf,
  // comments: commentsLeaf,
});
