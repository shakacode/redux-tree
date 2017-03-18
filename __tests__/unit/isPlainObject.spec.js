import { isPlainObject } from '../../src/utils';

describe('utils.isPlainObject()', () => {
  it('returns `true` for `{}`', () => {
    const result = isPlainObject({});
    expect(result).toBe(true);
  });

  it('returns `true` for `new Object()`', () => {
    const result = isPlainObject(new Object()); // eslint-disable-line no-new-object
    expect(result).toBe(true);
  });

  it('returns `false` for `[]`', () => {
    const result = isPlainObject([]);
    expect(result).toBe(false);
  });

  it('returns `false` for `new Array()`', () => {
    const result = isPlainObject(new Array()); // eslint-disable-line no-array-constructor, max-len
    expect(result).toBe(false);
  });

  it('returns `false` for `function`', () => {
    function imNotPlainObject() {}
    const result = isPlainObject(imNotPlainObject);
    expect(result).toBe(false);
  });

  it('returns `false` for arrow function', () => {
    const result = isPlainObject(v => v);
    expect(result).toBe(false);
  });

  it('returns `false` for `true`', () => {
    const result = isPlainObject(true);
    expect(result).toBe(false);
  });

  it('returns `false` for `false`', () => {
    const result = isPlainObject(false);
    expect(result).toBe(false);
  });

  it('returns `false` for `null`', () => {
    const result = isPlainObject(null);
    expect(result).toBe(false);
  });

  it('returns `false` for `undefined`', () => {
    const result = isPlainObject(undefined);
    expect(result).toBe(false);
  });

  it('returns `false` for `1`', () => {
    const result = isPlainObject(1);
    expect(result).toBe(false);
  });

  it('returns `false` for `\'string\'`', () => {
    const result = isPlainObject('string');
    expect(result).toBe(false);
  });

  it('returns `false` for `new Date()`', () => {
    const result = isPlainObject(new Date());
    expect(result).toBe(false);
  });
});
