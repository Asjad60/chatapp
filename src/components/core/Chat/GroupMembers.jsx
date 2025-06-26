import { motion } from "framer-motion";

const GroupMembers = ({ groupDetails, userId }) => {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <div className="mt-[16rem] min-[480px]:mt-[22rem]">
      <div>
        <h3 className={"text-2xl text-center  font-bold"}>
          {groupDetails?.groupName}
        </h3>
        <span className="text-xs p-2">
          Total members: {groupDetails?.members?.length}
        </span>
      </div>
      <motion.div
        className=" space-y-4 p-4 divide-y divide-slate-400/40"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {groupDetails?.members?.map((member) => (
          <motion.div
            key={member._id}
            variants={itemVariants}
            className="flex justify-between"
          >
            <div className="flex gap-4 items-center pt-2">
              <img
                src={member?.image.url}
                alt={member?.username}
                className="object-cover w-[40px] h-[40px] rounded-full"
              />
              <span className="text-slate-100">
                {member.username} {userId === member?._id && "(You)"}
              </span>
            </div>
            {member?._id === groupDetails?.admin?._id && (
              <span className="p-1 text-xs bg-[#255487] h-fit rounded-md mt-3 text-slate-100">
                Admin
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GroupMembers;
