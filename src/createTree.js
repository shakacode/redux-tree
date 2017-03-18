import { Record } from 'immutable';

import { createShell } from './utils';
import * as messages from './messages';

export const createTree = children => {
  const childrenNames = Object.keys(children);

  let initialized = false;

  return (state = createShell(childrenNames), action) => {
    // Record.isRecord method is available only in immutable@4.x
    // For now skipping this check if older version is used
    if (state && Record.isRecord && !Record.isRecord(state)) {
      throw new Error(messages.nonRecordState(state));
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
