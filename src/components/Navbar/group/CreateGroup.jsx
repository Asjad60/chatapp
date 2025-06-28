import { useEffect, useState } from "react";
import { getMyFriends } from "../../../services/operations/userAPI";
import FriendsList from "./FriendsList";
import Button from "../../Button";
import { createGroup } from "../../../services/operations/groupAPI";
import ImageUpload from "../../ImageUpload";

const CreateGroup = ({ setIsCreatingGroup }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState(null);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    console.log(groupName, selectedFriends);

    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("membersId", JSON.stringify(selectedFriends));
    formData.append("groupProfile", file);

    await createGroup(formData);

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
    <div>
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-xl font-bold font-edu-sa">Create Group</h3>
        <p className="text-xs text-slate-400">
          Please Enter group name and add a member to create a group
        </p>
      </div>
      <form onSubmit={handleCreateGroup}>
        <div className="flex gap-2 items-center">
          <ImageUpload setFile={setFile} />
          <input
            type="text"
            className="form-style"
            placeholder="Enter Group Name"
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <FriendsList
          friends={friends}
          setSelectedFriends={setSelectedFriends}
          selectedFriends={selectedFriends}
        />

        <Button customClass={"p-2 mt-2"}>Submit</Button>
      </form>
    </div>
  );
};

export default CreateGroup;
