import { Record, Map, OrderedSet } from 'immutable';

import Post from './entity';

export const PostsState = Record({
  index: new OrderedSet(),
  entities: new Map(),
});

// Populating state w/ dummy data
export default new PostsState({
  index: new OrderedSet([1, 2, 3]),
  entities:
    (new Map())
      .set(1, new Post({ id: 1, title: 'Post #1' }))
      .set(2, new Post({ id: 2, title: 'Post #2' }))
      .set(3, new Post({ id: 3, title: 'Post #3' })),
});
