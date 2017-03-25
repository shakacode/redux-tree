export const isReduxAction = type => type === '@@INIT' || /^@@redux\/.*$/.test(type);
