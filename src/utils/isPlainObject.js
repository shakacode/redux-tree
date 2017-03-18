export const isPlainObject = subject => (
  typeof subject === 'object'
  && Object.prototype.toString.call(subject) === '[object Object]'
);
