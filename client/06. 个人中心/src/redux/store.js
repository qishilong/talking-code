import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import typeReducer from "./typeSlice";
import articleReducer from "./articleSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    type: typeReducer,
    article: articleReducer
  },
});
