import React from "react";
import { getContextData } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const { token } = getContextData();
  if (token === null) {
    return children;
  } else {
    return <Navigate to={"/"} />;
  }
};

export default OpenRoute;
