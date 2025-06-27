import logo from "../assets/logo-1.png";

const Home = () => {
  return (
    <section className="overflow-hidden h-full opacity-30">
      <div
        className="h-full"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      ></div>
    </section>
  );
};

export default Home;
