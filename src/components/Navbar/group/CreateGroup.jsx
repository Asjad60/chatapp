import { useEffect, useState } from "react";
import { getMyFriends } from "../../../services/operations/userAPI";
import FriendsList from "./FriendsList";
import { createGroup } from "../../../services/operations/groupAPI";
import ImageUpload from "../../ImageUpload";
import { IoImagesOutline } from "react-icons/io5";

const CreateGroup = ({ setIsCreatingGroup }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("membersId", JSON.stringify(selectedFriends));
    formData.append("groupProfile", file);

    await createGroup(formData);
    setLoading(false);
    setIsCreatingGroup(false);
  };

  useEffect(() => {
    (async () => {
      const res = await getMyFriends();
      if (res) {
        setFriends(res.friends);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-extrabold text-slate-800">Create a Group</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Add a name, photo, and pick your friends
        </p>
      </div>

      <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
        {/* Image + Name row */}
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <ImageUpload setFile={setFile} />
          </div>
          <input
            type="text"
            className="flex-1 bg-white border border-slate-200 focus:border-[#0047e1] focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold placeholder:text-slate-400 outline-none transition-all duration-200 shadow-sm"
            placeholder="Group name..."
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        {/* Friends list */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Add Members
          </span>
          <FriendsList
            friends={friends}
            setSelectedFriends={setSelectedFriends}
            selectedFriends={selectedFriends}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#0047e1] hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl text-xs transition-all duration-200 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
