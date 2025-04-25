import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "./rootReducer"; // Import your root reducer

// const store = configureStore({
//   reducer: rootReducer, // Pass your root reducer here
// });

// export default store;
