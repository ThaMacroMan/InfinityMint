import React, { useState, useEffect } from 'react';

const ErrorPopup = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000); // Adjust the duration as needed (e.g., 3000 milliseconds for 3 seconds)

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {show && (
        <div className="error-popup">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default ErrorPopup;
