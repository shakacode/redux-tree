import { createBranch } from '../../../../lib';

/**
 * @desc `state.ui` branch.
 *
 */

import postsListLeaf from './PostsList/leaf';

export default createBranch({
  postsList: postsListLeaf,
});
