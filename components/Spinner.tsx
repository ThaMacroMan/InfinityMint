import React from 'react';

const Spinner = ({ message }: {message: string}) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default Spinner;
