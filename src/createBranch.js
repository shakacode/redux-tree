import { Record } from 'immutable';

import { createShell, isReduxAction } from './utils';
import * as messages from './messages';

export const createBranch = children => {
  const childrenNames = Object.keys(children);

  let keyPath;

  return (state, action, parentKeyPath) => {
    if (!keyPath) {
      keyPath = [].concat(parentKeyPath);
    }

    return state.withMutations(nextState => {
      if (isReduxAction(action.type)) {
        const branchState = nextState.getIn(keyPath);

        if (!branchState) {
          nextState.setIn(keyPath, createShell(childrenNames));
        // Record.isRecord method is available only in immutable@4.x
        // For now skipping this check if older version is used
        } else if (Record.isRecord && !Record.isRecord(branchState)) {
          throw new Error(messages.nonRecordState(branchState));
        }
      }

      childrenNames.forEach(child => {
        const childKeyPath = keyPath.concat(child);
        // eslint-disable-next-line no-param-reassign
        nextState = children[child](nextState, action, childKeyPath);
      });
    });
  };
};
