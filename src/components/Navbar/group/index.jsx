import JoinGroup from "./JoinGroup";
import CreateGroup from "./CreateGroup";
import { motion } from "framer-motion";
import { useState } from "react";

const JOIN_GROUP = "JOIN_GROUP";
const CREATE_GROUP = "CREATE_GROUP";

const tabElements = ["Join Group", "Create Group"];

const GroupTemplate = ({ setIsCreatingGroup }) => {
  const [selectedTab, setSelectedTab] = useState(JOIN_GROUP);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-800">Groups</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Join an existing group or create your own</p>
      </div>

      {/* Tab switcher */}
      <div className="relative flex gap-2 bg-slate-100 p-1 rounded-2xl">
        {tabElements.map((item, i) => {
          const actualTabName = item.split(" ").join("_").toUpperCase();
          const isActive = selectedTab === actualTabName;

          return (
            <button
              key={i}
              type="button"
              className={`relative flex-1 z-10 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-[#0047e1]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => setSelectedTab(actualTabName)}
            >
              {isActive && (
                <motion.div
                  layoutId="tabHighlight"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60 z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {item}
            </button>
          );
        })}
      </div>

      <div>
        {selectedTab === JOIN_GROUP && <JoinGroup />}
        {selectedTab === CREATE_GROUP && (
          <CreateGroup setIsCreatingGroup={setIsCreatingGroup} />
        )}
      </div>
    </div>
  );
};

export default GroupTemplate;
