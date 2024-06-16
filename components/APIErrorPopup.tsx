import React, { useEffect, useRef } from 'react';

interface APIErrorPopupProps {
  message: string;
  onClose: () => void;
}

const APIErrorPopup: React.FC<APIErrorPopupProps> = ({ message, onClose }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      onClose();
      timerRef.current = null;
    }, 5000);

    // Cleanup function to clear the timer
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [message, onClose]);

  return (
    <div className="api-error-popup" onClick={onClose}>
      <p>{message}</p>
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
    </div>
  );
};

export default APIErrorPopup;
