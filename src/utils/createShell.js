import { Record } from 'immutable';

export const createShell = branches => {
  const shell = branches.reduce(
    (state, branch) => ({ ...state, [branch]: undefined }),
    {},
  );
  const Shell = Record(shell);

  return new Shell();
};
