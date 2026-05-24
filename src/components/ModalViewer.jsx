import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const ModalViewer = ({ children, onClose }) => {
  return createPortal(
    <motion.div
      className="fixed inset-0 flex justify-center items-center z-[1000] bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-[#f8f9fb] text-slate-800 p-6 rounded-3xl shadow-2xl shadow-black/10 max-w-lg w-full border border-slate-200/70"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ModalViewer;
