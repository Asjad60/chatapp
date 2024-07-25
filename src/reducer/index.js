import { combineReducers } from "@reduxjs/toolkit";
import chatReducer from "../slices/chatSlice";

const rootReducer = combineReducers({
  chat: chatReducer,
});

export default rootReducer;
