import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import OpenRoute from "./components/OpenRoute";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Error from "./pages/Error";
import { getContextData } from "./context/AuthProvider";
import { getMyProfile } from "./services/operations/userAPI";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Chat = lazy(() => import("./pages/Chat"));
const Notification = lazy(() => import("./pages/Notification"));
const Wrapper = lazy(() => import("./components/Wrapper"));

function App() {
  const navigate = useNavigate();
  const { setUser, setToken } = getContextData();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getMyProfile(setToken, setUser, navigate);
    }
  }, []);

  return (
    <main className="App flex flex-col h-screen font-comfortaa [background:radial-gradient(110%_110%_at_50%_10%,#000_40%,#29536E_100%)]">
      <div className="z-10">
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
              path="/reset-password"
              element={
                <OpenRoute>
                  <ResetPassword />
                </OpenRoute>
              }
            />
            <Route
              path="/update-password/:token"
              element={
                <OpenRoute>
                  <UpdatePassword />
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

            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  );
}

export default App;
