import { isReduxAction } from '../../src/utils';

describe('utils.isReduxAction()', () => {
  it('returns `true` for `@@redux/INIT`', () => {
    const result = isReduxAction('@@redux/INIT');
    expect(result).toBe(true);
  });

  it('returns `true` for `@@redux/PROBE_UNKNOWN_ACTION_*`', () => {
    const result = isReduxAction('@@redux/PROBE_UNKNOWN_ACTION_t.e.7.o.c.b.7.f.4.6.y.p.o.2.o.c.g.1.4.i');
    expect(result).toBe(true);
  });

  it('returns `true` for `@@INIT`', () => {
    const result = isReduxAction('@@INIT');
    expect(result).toBe(true);
  });

  it('returns `false` for the rest', () => {
    const result = isReduxAction('INIT');
    expect(result).toBe(false);
  });
});
