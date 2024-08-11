import React from "react";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <section
      className="overflow-hidden h-[700px] w-full"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        filter: "saturate(0) opacity(10%)",
      }}
    >
      {/* <picture>
        <img
          src={logo}
          alt="App-Logo"
          className="hidden sm:block mix-blend-overlay object-cover h-full w-full aspect-auto"
        />
      </picture> */}
    </section>
  );
};

export default Home;
