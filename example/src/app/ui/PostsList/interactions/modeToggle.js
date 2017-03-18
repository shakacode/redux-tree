const MODE_TOGGLE: 'MODE_TOGGLE' = 'MODE_TOGGLE';

// Action creator
export const toggleMode = () => ({ type: MODE_TOGGLE });

// Action handler
export const onModeToggle = {
  [MODE_TOGGLE]:
    state =>
      state.set('isManaging', !state.isManaging),
};
