import { Record } from 'immutable';

import { createShell } from './utils';

export const createTree = children => {
  const childrenNames = Object.keys(children);

  let initialized = false;

  return (state = createShell(childrenNames), action) => {
    if (state && !Record.isRecord(state)) {
      throw new Error(
        `State must be Immutable Record. Received: ${JSON.stringify(state)}`,
      );
    }

    return state.withMutations(nextState => {
      childrenNames.forEach(child => {
        // eslint-disable-next-line no-param-reassign
        nextState = children[child](nextState, action, child, initialized);
      });

      if (!initialized) initialized = true;
    });
  };
};
