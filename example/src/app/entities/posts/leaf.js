import { createLeaf } from '../../../../../lib';

/**
 * @desc `state.entities.posts` leaf.
 *
 */

import state from './state';

export default createLeaf(state); // <= Not passing any reducer
