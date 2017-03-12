import { createTree } from '../../../lib';

/**
 * @desc Creating the Tree. Tree is a root reducer in fact.
 *
 */

import entitiesBranch from './entities/branch';
import uiBranch from './ui/branch';

export default createTree({
  entities: entitiesBranch,
  ui: uiBranch,
});


/**
 * State shape:
 *
 * state:
 *   entities:
 *     posts: {
 *       index: Set<PostId>
 *       entities: Map<PostId, Post>
 *     }
 *   ui:
 *     postsList: {
 *       isManaging: boolean
 *       processingPosts: Set<PostId>
 *     }
 */
