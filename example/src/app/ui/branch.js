import { createBranch } from '../../../../lib/redux-tree.cjs';

/**
 * @desc `state.ui` branch.
 *
 */

import postsListLeaf from './PostsList/leaf';

export default createBranch({
  postsList: postsListLeaf,
});
