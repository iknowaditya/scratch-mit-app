// components/reducerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sprites: {
    1: {
      message: "Hello!",
      showMessage: false,
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
    INITIALIZE_SPRITE: (state, action) => {
      const { spriteId } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = {
          message: "",
          showMessage: false,
          bubblePosition: { top: 0, left: 0, show: "none" },
          x: 100,
          y: 100,
          rotation: 0,
          visible: true,
          queue: [],
        };
      }
    },
    SET_MESSAGE: (state, action) => {
      const { spriteId, message } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { ...initialState.sprites["1"] };
      }
      state.sprites[spriteId].message = message;
    },
    ENQUEUE_ACTION: (state, action) => {
      const { spriteId, action: actionData } = action.payload;
      if (!state.sprites[spriteId]) {
        state.sprites[spriteId] = { queue: [] }; // Initialize if doesn't exist
      }
      state.sprites[spriteId].queue.push(actionData);
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
  },
});

export const {
  ENQUEUE_ACTION,
  SET_MESSAGE,
  SET_SHOW_MESSAGE,
  SET_BUBBLE_POSITION,
  INITIALIZE_SPRITE,
  SWAP_ANIMATIONS,
  SET_ROTATION,
} = spriteSlice.actions;

export default spriteSlice.reducer;
