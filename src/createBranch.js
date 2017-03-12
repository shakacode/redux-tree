import { Record } from 'immutable';

import { createShell } from './utils';

export const createBranch = children => {
  const childrenNames = Object.keys(children);

  let keyPath;

  return (state, action, parentKeyPath, initialized) => {
    if (!keyPath) {
      keyPath = [].concat(parentKeyPath);
    }

    return state.withMutations(nextState => {
      if (!initialized && !Record.isRecord(nextState.getIn(keyPath))) {
        nextState.setIn(keyPath, createShell(childrenNames));
      }

      childrenNames.forEach(child => {
        const childKeyPath = keyPath.concat(child);
        // eslint-disable-next-line no-param-reassign
        nextState = children[child](nextState, action, childKeyPath, initialized);
      });
    });
  };
};
