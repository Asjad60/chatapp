import { useEffect, useState } from "react";
import {
  fetchGroupsExceptMy,
  JoinToGroup,
} from "../../../services/operations/groupAPI";
import { getSocket } from "../../../context/SocketProvider";
import { IoSearchOutline, IoPeopleOutline } from "react-icons/io5";

const JoinGroup = () => {
  const [groups, setGroups] = useState([]);
  const [joiningId, setJoiningId] = useState(null);
  const socket = getSocket();

  const fetchGroups = async () => {
    const result = await fetchGroupsExceptMy();
    if (result) {
      setGroups(result.data);
    }
  };

  const handleJoinGroup = async (groupId) => {
    setJoiningId(groupId);
    const result = await JoinToGroup(groupId);
    if (result?.success) {
      fetchGroups();
    }
    setJoiningId(null);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col gap-3 h-[380px] overflow-y-auto light-scrollbar pr-1">
      {groups?.length > 0 ? (
        groups.map((group) => (
          <div
            key={group?._id}
            className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200/70 rounded-2xl hover:border-blue-100 transition-all duration-200 chat-shadow-sm"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {group?.groupProfile ? (
                <img
                  src={group.groupProfile}
                  alt={group.groupName}
                  className="w-10 h-10 aspect-square rounded-full object-cover border border-slate-100 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#0047e1]/10 text-[#0047e1] flex items-center justify-center font-bold text-sm uppercase">
                  {group?.groupName?.[0]}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">{group.groupName}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <IoPeopleOutline size={11} />
                  {group?.members?.length || 0} members
                </span>
              </div>
            </div>

            <button
              onClick={() => handleJoinGroup(group._id)}
              disabled={joiningId === group._id}
              className="shrink-0 px-3.5 py-1.5 bg-[#0047e1]/10 text-[#0047e1] hover:bg-[#0047e1] hover:text-white border border-[#0047e1]/20 hover:border-[#0047e1] rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {joiningId === group._id ? "..." : "Join"}
            </button>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <IoPeopleOutline size={22} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">No groups available to join</p>
        </div>
      )}
    </div>
  );
};

export default JoinGroup;
