import { Record, Map, OrderedSet } from 'immutable';

import Post from '../app/entities/posts/entity';
import { PostsState } from '../app/entities/posts/state';
import { State as PostsListState } from '../app/ui/PostsList/state';

/**
 * @desc In case of SSR, initial state is passed from the server.
 *       Redux store is rehydrated with the passed data on the initialization.
 *
 *       To handle serialization of immutable structures use:
 *       https://github.com/glenjamin/transit-immutable-js
 *
 *       Rehydrated state shape:
 *       {
 *         entities: {
 *           posts: {
 *             index: [1, 2, 3],
 *             entities: {
 *               1: { id: 1, title: 'Rehydrated Post #1' },
 *               2: { id: 2, title: 'Rehydrated Post #2' },
 *               3: { id: 3, title: 'Rehydrated Post #3' },
 *             },
 *           },
 *         },
 *         ui: {
 *           postsList: {
 *             isManaging: true,
 *             processingPosts: [],
 *           }
 *         }
 *       }
 */

const State = Record({
  entities: undefined,
  ui: undefined,
});

const Entities = Record({
  posts: undefined,
});

const UI = Record({
  postsList: undefined,
});

export default new State({
  entities: new Entities({
    posts: new PostsState({
      index: new OrderedSet([1, 2, 3]),
      entities:
        (new Map())
          .set(1, new Post({ id: 1, title: 'Rehydrated Post #1' }))
          .set(2, new Post({ id: 2, title: 'Rehydrated Post #2' }))
          .set(3, new Post({ id: 3, title: 'Rehydrated Post #3' })),
    }),
  }),
  ui: new UI({
    postsList: new PostsListState(),
  }),
});
