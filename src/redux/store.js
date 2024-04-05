import { configureStore } from "@reduxjs/toolkit";
import typeReducer from "./typeSlice";
import articleReducer from "./articleSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    type: typeReducer,
    article: articleReducer,
    user: userReducer,
  },
});
