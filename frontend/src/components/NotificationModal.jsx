import React from 'react';

const NotificationModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with increased zIndex */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
        style={{ zIndex: 10, position: 'fixed', left: -10 }} // Add higher zIndex here
        onClick={onClose}
      />
      {/* Modal with higher zIndex */}
      <div
        className="fixed right-4 top-16 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
        style={{ zIndex: 20 }} // Ensure modal zIndex is higher than the backdrop
      >
        <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {children}
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
