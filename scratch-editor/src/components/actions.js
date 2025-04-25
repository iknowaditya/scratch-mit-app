export const enqueueAction = (action, spriteId) => ({
  type: "ENQUEUE_ACTION",
  payload: {
    action,
    spriteId,
  },
});

export const setMessage = (message, spriteId) => ({
  type: "SET_MESSAGE",
  payload: {
    message,
    spriteId,
  },
});

export const setShowMessage = (show, spriteId) => ({
  type: "SET_SHOW_MESSAGE",
  payload: {
    show,
    spriteId,
  },
});

export const setBubblePosition = (position, spriteId) => ({
  type: "SET_BUBBLE_POSITION",
  payload: {
    position,
    spriteId,
  },
});

export const swapAnimations = (spriteId1, queue1, spriteId2, queue2) => ({
  type: "SWAP_ANIMATIONS",
  payload: {
    spriteId1,
    queue1,
    spriteId2,
    queue2,
  },
});

export const playAllSprites = () => ({
  type: "PLAY_ALL_SPRITES",
});

export const initializeSprite = (spriteId) => ({
  type: "INITIALIZE_SPRITE",
  payload: { spriteId },
});
