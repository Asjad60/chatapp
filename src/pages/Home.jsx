import logo from "../assets/logo-1.png";

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
          filter: "opacity(0.6)",
        }}
      ></div>
    </section>
  );
};

export default Home;
