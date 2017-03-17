export const REDUCERS_EXAMPLES = `
    Provide action handlers to the "createLeaf" function in one of the following ways:

    Option #1:
      { ACTION_TYPE: (state, action) => state }

    Option #2:
      {
        ACTION_TYPE: {
          leaf: ['path', 'to', 'leaf'],
          reduce: (state, action) => state,
        },
      }

    Option #3:
      {
        ACTION_TYPE: [
          (state, action) => state,

          {
            leaf: ['path', 'to', 'leaf'],
            reduce: (state, action) => state,
          },
        ],
      }
`;


export const nonRecordState = state => {
  const stringifiedState = JSON.stringify(state);
  return `State must be Immutable Record. Received: ${stringifiedState}`;
};


export const undefinedState = (keyPath, action) => {
  const stringifiedKeyPath = JSON.stringify(keyPath);
  const stringifiedAction = JSON.stringify(action);

  return (`
    Reducer at keypath ${stringifiedKeyPath} returned undefined.
    To ignore an action, you must explicitly return the previous state.
    If you want this reducer to hold no value, you can return null instead of undefined.

    Keypath: ${stringifiedKeyPath}
    Action: ${stringifiedAction}
  `);
};


export const badKeyPath = (keyPath, action) => {
  const stringifiedKeyPath = JSON.stringify(keyPath);
  const stringifiedAction = JSON.stringify(action);

  return (`
    "action.${action.type}" was dispatched.
    Trying to update state at keypath ${stringifiedKeyPath} but resolved value is undefined.
    Most likely you misspelled one of the keys in the leaf keypath.
    Re-check your action handlers for this action.

    Keypath: ${stringifiedKeyPath}
    Action: ${stringifiedAction}
  `);
};


export const badActionHandler = (actionHandler, action) => {
  const stringifiedActionHandler = JSON.stringify(actionHandler);
  const stringifiedAction = JSON.stringify(action);

  return (`
    Invalid action handler is passed for "action.${action.type}".

    Received:
      Action: ${stringifiedAction}
      Action handler: ${stringifiedActionHandler}

    ${REDUCERS_EXAMPLES}
  `);
};
