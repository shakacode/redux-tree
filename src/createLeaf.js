import { isPlainObject } from './utils';
import * as messages from './messages';

export const createLeaf = (initialState, reducers) => {
  if (typeof initialState === 'undefined') {
    throw new Error(`
      "createLeaf" recieved undefined on initialisation.
      The initial state may not be undefined.
      If you don't want to set a value for this reducer,
      you can use null instead of undefined.
    `);
  }

  if (reducers && !isPlainObject(reducers)) {
    throw new Error(`
      Invalid action handlers are passed to "createLeaf" function.

      Received:
        arg #1: ${JSON.stringify(initialState)}
        arg #2: ${JSON.stringify(reducers)}

      ${messages.REDUCERS_EXAMPLES}
    `);
  }

  if (process.env.NODE_ENV !== 'production') {
    // TODO: Validate reducers shape.
  }

  return (state, action, keyPath, initialized) => {
    const leafKeyPath = Array.isArray(keyPath) ? keyPath : [keyPath];
    const leafState = state.getIn(leafKeyPath);

    return state.withMutations(nextState => {
      // If reducer is a plain function w/ the switch statement
      if (!reducers && typeof initialState === 'function') {
        const reducer = initialState;
        const nextLeafState = reducer(leafState, action);
        if (typeof nextLeafState === 'undefined') {
          throw new Error(messages.undefinedState(leafKeyPath, action));
        }
        return nextState.setIn(leafKeyPath, nextLeafState);
      }

      // On initialization
      if (!initialized) {
        // Do nothing if state is rehydrated
        if (typeof leafState !== 'undefined') return;
        // Otherwise set initial state
        return nextState.setIn(leafKeyPath, initialState);
      }

      // No reducers attached to the leaf,
      // it's fine as the state might be changed from another leafs
      if (!reducers) return;

      const { type, ...payload } = action;

      // No reaction required, exiting
      if (!reducers[type]) return;

      // If value of action type key is function -> reducing local leaf state
      if (typeof reducers[type] === 'function') {
        const nextLeafState = reducers[type](leafState, payload);
        if (typeof nextLeafState === 'undefined') {
          throw new Error(messages.undefinedState(leafKeyPath, action));
        }
        return nextState.setIn(leafKeyPath, nextLeafState);
      }

      // If it's an object w/ keypath to leaf and reducer -> reducing leaf state at keypath
      if (isPlainObject(reducers[type])) {
        const externalLeafKeyPath = reducers[type].leaf;
        const externalLeafState = nextState.getIn(externalLeafKeyPath);
        if (typeof externalLeafState === 'undefined') {
          // NOTE: Might worth to check if this is exactly leaf, not a branch, at provided keypath.
          //       But this data must be stored somewhere. Premature optimisation at this point.
          throw new Error(messages.badKeyPath(externalLeafKeyPath, action));
        }

        const nextExternalLeafState = reducers[type].reduce(externalLeafState, payload);
        if (typeof nextExternalLeafState === 'undefined') {
          throw new Error(messages.undefinedState(externalLeafKeyPath, action));
        }
        return nextState.setIn(externalLeafKeyPath, nextExternalLeafState);
      }

      // If it's an array -> iterating
      if (Array.isArray(reducers[type])) {
        return reducers[type].forEach(reducer => {
          // If array's item is a function -> reducing local leaf state
          if (typeof reducer === 'function') {
            const nextLeafState = reducer(leafState, payload);
            if (typeof nextLeafState === 'undefined') {
              throw new Error(messages.undefinedState(leafKeyPath, action));
            }
            return nextState.setIn(leafKeyPath, nextLeafState);
          }

          // Otherwise reducing state of the leaf at provided keypath
          const externalLeafState = nextState.getIn(reducer.leaf);
          if (typeof externalLeafState === 'undefined') {
            throw new Error(messages.badKeyPath(reducer.leaf, action));
          }

          const nextExternalLeafState = reducer.reduce(externalLeafState, payload);
          if (typeof nextExternalLeafState === 'undefined') {
            throw new Error(messages.undefinedState(reducer.leaf, action));
          }
          return nextState.setIn(reducer.leaf, nextExternalLeafState);
        });
      }

      throw new Error(messages.badActionHandler(reducers[type], action));
    });
  };
};
