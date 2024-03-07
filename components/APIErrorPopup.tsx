import React from 'react';

const ErrorPopup = ({ message, onClose }: { message: string, onClose: () => void }) => {
  return (
    <div className="error-popup" onClick={onClose}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPopup;
