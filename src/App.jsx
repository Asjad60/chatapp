import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import OpenRoute from "./components/OpenRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Chat = lazy(() => import("./pages/Chat"));
const Notification = lazy(() => import("./pages/Notification"));
const Wrapper = lazy(() => import("./components/Wrapper"));

function App() {
  return (
    <main className="App flex flex-col min-h-screen w-screen dark:bg-[#212121] dark:text-[#fff] text-black font-comfortaa">
      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center">
            <div className="loader"></div>
          </div>
        }
      >
        <Routes>
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            element={
              <PrivateRoute>
                <Wrapper />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/notification" element={<Notification />} />
          </Route>
        </Routes>
      </Suspense>
    </main>
  );
}

export default App;
