import React from "react";
import {
  IoSearchOutline,
  IoPeopleOutline,
  IoFlameOutline,
  IoCompassOutline,
} from "react-icons/io5";

const Discovery = () => {
  // Curated trending spaces to populate the discovery view professionally
  const trendingSpaces = [
    {
      id: 1,
      name: "React & Vite Devs",
      description:
        "Discussion about building high-performance frontend applications using React and Vite.",
      members: "2.4K members",
      category: "Technology",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      name: "Design & UX Critique",
      description:
        "Share your wireframes, UI mockups, and get feedback from experienced product designers.",
      members: "1.8K members",
      category: "Design",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Project Team Alpha",
      description:
        "Official public workspace channel for the Alpha launch project.",
      members: "420 members",
      category: "Productivity",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col dotted-bg font-comfortaa overflow-y-auto p-6 md:p-8 light-scrollbar">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[#0047e1]">
            <IoCompassOutline size={24} className="shrink-0" />
            <h1 className="text-xl font-extrabold tracking-tight">
              Discovery Space
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explore trending channels, public communities, and new spaces to
            connect.
          </p>
        </div>

        {/* Localized Search */}
        <div className="w-full md:max-w-xs flex items-center bg-white rounded-2xl px-4 py-2 border border-slate-100 chat-shadow-sm">
          <IoSearchOutline size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search channels..."
            className="w-full bg-transparent outline-none border-none pl-2.5 text-slate-700 text-xs font-semibold placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="flex flex-col gap-8">
        {/* Section 1: Hero Banner */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md shadow-blue-500/10">
          <div className="relative z-10 max-w-lg flex flex-col">
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full w-fit">
              Featured Space
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold mt-3 leading-tight">
              Connect with Creative Minds globally in real-time
            </h2>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Chit Chat allow communities and seamless collaboration.
            </p>
          </div>
          <div className="absolute top-[-30%] right-[-10%] w-[250px] h-[250px] bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Section 2: Trending Spaces List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 px-1">
            <IoFlameOutline size={18} className="text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-800">
              Trending Spaces
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingSpaces.map((space) => (
              <div
                key={space.id}
                className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col justify-between hover:border-blue-200 transition-all duration-200 chat-shadow-sm group"
              >
                <div>
                  {/* Category Pill */}
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {space.category}
                  </span>

                  {/* Title */}
                  <h4 className="text-xs font-extrabold text-slate-800 mt-2 group-hover:text-[#0047e1] transition-colors duration-150">
                    {space.name}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-3 font-medium">
                    {space.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <IoPeopleOutline size={14} className="text-slate-400" />
                    {space.members}
                  </span>

                  <button className="px-3.5 py-1.5 bg-[#0047e1]/10 text-[#0047e1] font-bold rounded-xl text-[10px] hover:bg-[#0047e1] hover:text-white transition-all duration-200 cursor-pointer">
                    Join Space
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
