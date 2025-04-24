const initialState = {
  bubblePosition: { top: 0, left: 0 },
  showMessage: false,
  message: "Hello!",
  previousActions: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ENQUEUE":
      return {
        ...state,
        previousActions: [...state.previousActions, action.payload],
      };
    case "DEQUEUE":
      return {
        ...state,
        previousActions: state.previousActions.slice(1),
      };
    case "SET_BUBBLE_POSITION":
      return {
        ...state,
        bubblePosition: action.payload,
      };
    case "SET_SHOW_MESSAGE":
      return {
        ...state,
        showMessage: action.payload,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
