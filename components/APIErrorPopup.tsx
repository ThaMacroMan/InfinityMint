import React, { useEffect } from 'react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="error-popup">
      <p>{message}</p>
      <div className="sliding-bar"></div>
    </div>
  );
};

export default ErrorPopup;
