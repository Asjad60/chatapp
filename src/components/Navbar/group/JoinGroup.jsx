import { useEffect, useState } from "react";
import Button from "../../Button";
import {
  fetchGroupsExceptMy,
  JoinToGroup,
} from "../../../services/operations/groupAPI";
import { getSocket } from "../../../context/SocketProvider";

const JoinGroup = () => {
  const [groups, setGroups] = useState([]);
  const socket = getSocket();

  const fetchGroups = async () => {
    const result = await fetchGroupsExceptMy();
    if (result) {
      setGroups(result.data);
    }
  };

  const handleJoinGroup = async (groupId) => {
    const result = await JoinToGroup(groupId);
    if (result.success) {
      fetchGroups();
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="overflow-auto h-[425px] w-full">
      {groups?.length > 0 ? (
        <div className="w-full space-y-4 mt-4">
          {groups?.map((group) => (
            <div
              className="flex gap-4 items-center justify-between w-full"
              key={group?._id}
            >
              <div className="flex gap-4 items-center">
                {group?.groupProfile ? (
                  <img
                    src={group.groupProfile}
                    alt={group.groupName}
                    className="w-[40px] aspect-square rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[40px] uppercase aspect-square rounded-full object-cover flex items-center justify-center bg-[#29536E]">
                    {group?.groupName}
                  </div>
                )}
                <span>{group.groupName}</span>
              </div>
              <Button
                onClick={() => handleJoinGroup(group._id)}
                customClass={"py-0.5 px-2"}
              >
                Join
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div>Not found</div>
      )}
    </div>
  );
};

export default JoinGroup;
