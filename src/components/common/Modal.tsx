import React from 'react';

const Modal: React.FC<{ open: boolean; onClose: ()=>void; title?: string; children?: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;