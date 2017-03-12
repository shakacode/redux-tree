import { Record, Set } from 'immutable';

export const State = Record({
  isManaging: true,
  processingPosts: new Set(),
});

export default new State();
