import { schema } from 'normalizr';

const post = new schema.Entity('posts');
const posts = new schema.Array(post);

export { post, posts };
