// pages/YourComponent.tsx

import React from 'react';
import DownloadImage from '../components/DownloadImage'; // Assuming DownloadImageButton component is in a 'components' directory
console.log("YourComponent file");
const YourComponent: React.FC = () => {
  const imageUrl = 'https://example.com/image.jpg'; // URL of the image you want to download

  return (
    <div>
      <DownloadImage imageUrl={imageUrl} />
    </div>
  );
};

export default YourComponent;
