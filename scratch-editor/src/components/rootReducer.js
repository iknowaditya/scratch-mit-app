import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sprites: {
    1: {
      message: "Hello!",
      thinkMessage: "Hmm...",
      showMessage: false,
      showThink: false,
      bubblePosition: { top: 0, left: 0, show: "none" },
      x: 100,
      y: 100,
      rotation: 0,
      visible: true,
      queue: [],
    },
  },
};

const spriteSlice = createSlice({
  name: "sprites",
  initialState,
  reducers: {
    ENQUEUE_ACTION: (state, action) => {
      const { spriteId, action: actionData } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { ...initialState.sprites["1"] };
      }
      state.sprites[spriteId].queue.push(actionData);
    },
    SET_MESSAGE: (state, action) => {
      const { spriteId, message } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { ...initialState.sprites["1"] };
      }
      state.sprites[spriteId].message = message;
    },
    SET_SHOW_MESSAGE: (state, action) => {
      const { spriteId, show } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { ...initialState.sprites["1"] };
      }
      state.sprites[spriteId].showMessage = show;
    },
    SET_BUBBLE_POSITION: (state, action) => {
      const { spriteId, position } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { ...initialState.sprites["1"] };
      }
      state.sprites[spriteId].bubblePosition = position;
    },
    SWAP_ANIMATIONS: (state, action) => {
      const { spriteId1, queue1, spriteId2, queue2 } = action.payload;
      if (state.sprites[spriteId1]) {
        state.sprites[spriteId1].queue = queue1;
      }
      if (state.sprites[spriteId2]) {
        state.sprites[spriteId2].queue = queue2;
      }
    },
  },
});

export const {
  ENQUEUE_ACTION,
  SET_MESSAGE,
  SET_SHOW_MESSAGE,
  SET_BUBBLE_POSITION,
  SWAP_ANIMATIONS,
} = spriteSlice.actions;

export default spriteSlice.reducer;
