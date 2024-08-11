import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="text-9xl font-extrabold text-gray-700 tracking-widest">
          404
        </div>
        <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute text-zinc-50">
          Page Not Found
        </div>
      </div>

      <Link to="/" className="mt-10">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default Error;
