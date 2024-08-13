import React from "react";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <section>
      <div
        className="overflow-hidden h-[75vh] w-full"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "saturate(0) opacity(10%)",
        }}
      ></div>
    </section>
  );
};

export default Home;
