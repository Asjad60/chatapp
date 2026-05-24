const FriendsList = ({ friends, setSelectedFriends, selectedFriends }) => {
  const handleCheckesUser = (isChecked, friendId) => {
    setSelectedFriends((prev) => {
      if (isChecked) {
        return [...prev, friendId];
      } else {
        return prev.filter((id) => id !== friendId);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full h-[200px] overflow-y-auto light-scrollbar mt-3 pr-1">
      {friends.length > 0 ? (
        friends.map((frnd) => {
          const isSelected = selectedFriends.includes(frnd._id);
          return (
            <label
              key={frnd._id}
              htmlFor={`${frnd.username}-checkbox`}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-slate-200/60 hover:border-slate-300"
              }`}
            >
              <div className="flex gap-2.5 items-center">
                <img
                  src={frnd.image.url}
                  alt={frnd.username}
                  className="w-8 h-8 object-cover rounded-full border border-slate-100"
                  loading="lazy"
                />
                <span className={`capitalize text-xs font-bold ${isSelected ? "text-[#0047e1]" : "text-slate-700"}`}>
                  {frnd.username}
                </span>
              </div>

              <input
                type="checkbox"
                id={`${frnd.username}-checkbox`}
                name="friend-checkbox"
                onChange={(e) => handleCheckesUser(e.target.checked, frnd._id)}
                checked={isSelected}
                required={selectedFriends.length === 0}
                className="w-4 h-4 accent-[#0047e1] cursor-pointer"
              />
            </label>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-xs text-slate-400 font-semibold">
            No friends yet. Send a friend request first!
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
