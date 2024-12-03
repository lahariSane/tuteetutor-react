import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationModal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with increased zIndex */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
            style={{ zIndex: 10, position: 'fixed', left: -10 }} // Add higher zIndex here
            onClick={onClose}
          />
          {/* Modal with higher zIndex */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
            style={{ zIndex: 20 }} // Ensure modal zIndex is higher than the backdrop
          >
            <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
