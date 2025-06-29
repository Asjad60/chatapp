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
    <div className="flex flex-col gap-6">
      <div className="relative flex gap-2">
        {tabElements.map((item, i) => {
          const actualTabName = item.split(" ").join("_").toUpperCase();

          return (
            <div
              key={i}
              className={`relative cursor-pointer border z-10 border-[#29536E] p-2 font-semibold text-lg rounded-lg `}
              onClick={() => setSelectedTab(actualTabName)}
            >
              {selectedTab === actualTabName && (
                <motion.div
                  layoutId="tabHighlight"
                  className="absolute inset-0 bg-[#29536E] rounded-lg z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {item}
            </div>
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
