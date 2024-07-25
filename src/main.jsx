import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import SocketProvider from "./context/SocketProvider.jsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./reducer/index.js";

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SocketProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </SocketProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
