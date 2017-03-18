import { createBranch } from '../../../../lib';

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
