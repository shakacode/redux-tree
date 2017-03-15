import { Record } from 'immutable';
import { createShell } from '../../src/utils';

describe('utils.createShell', () => {
  it('creates Record with undefined values', () => {
    const branches = ['entities', 'ui'];
    const shell = createShell(branches);

    expect(shell).toBeInstanceOf(Record);
    expect(shell).toMatchSnapshot();
  });
});
