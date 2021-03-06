export const calc = (stages, items, stageSelected, impossessions) => ({
  type: 'CALC',
  items,
  stages,
  stageSelected,
  impossessions,
});

export const swipeItem = (category, pos) => ({
  type: 'CHANGE_FOCUS',
  category,
  pos,
});

export const resetFocus = () => ({
  type: 'ZERO_RESET_FOCUS',
});

export const setHighScorePossessionFocus = bestCoordinates => ({
  type: 'CALC_FOCUS',
  bestCoordinates,
});
