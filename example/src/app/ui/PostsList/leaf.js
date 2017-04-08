import { createLeaf } from '../../../../../lib/redux-tree.cjs';

/**
 * @desc `state.ui.postsList` leaf.
 *
 */

import state from './state';

import { onModeToggle } from './interactions/modeToggle';
import { onPostDelete } from './interactions/postDelete';

export default createLeaf(state, {
  ...onModeToggle,
  ...onPostDelete,
});
