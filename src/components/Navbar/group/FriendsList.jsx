const FriendsList = ({ friends, setSelectedFriends, selectedFriends }) => {
  const handleCheckesUser = (isChecked, friendId) => {
    console.log(isChecked);
    setSelectedFriends((prev) => {
      if (isChecked) {
        return [...prev, friendId];
      } else {
        return prev.filter((id) => id !== friendId);
      }
    });
  };

  return (
    <div className="flex flex-col divide-y divide-slate-400/30 w-full h-[250px] overflow-auto mt-3">
      {friends.length > 0 ? (
        friends.map((frnd) => (
          <div className="flex justify-between p-2" key={frnd._id}>
            <div className={`flex gap-2 items-center`}>
              <picture>
                <img
                  src={frnd.image.url}
                  alt={frnd.username}
                  className="w-[40px] h-[40px] object-cover rounded-full"
                  loading="lazy"
                />
              </picture>
              <span className="capitalize text-sm">{frnd.username}</span>
            </div>

            <input
              type="checkbox"
              id="friend-checkbox"
              name="friend-checkbox"
              onChange={(e) => handleCheckesUser(e.target.checked, frnd._id)}
              checked={selectedFriends.includes(frnd._id)}
              required={selectedFriends.length === 0}
            />
          </div>
        ))
      ) : (
        <div>You dont't have any friends. Send request to make friends</div>
      )}
    </div>
  );
};

export default FriendsList;
