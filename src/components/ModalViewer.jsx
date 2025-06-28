import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const ModalViewer = ({ children, onClose }) => {
  return createPortal(
    <motion.div
      className="fixed inset-0 flex justify-center items-center transition-all duration-300 z-[1000] bg-black/40 p-2 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="bg-[#193858] text-white p-4 rounded-md shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ModalViewer;
