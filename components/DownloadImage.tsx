// components/DownloadImage.tsx

import React from 'react';

interface DownloadImageProps {
  imageUrl: string;
}

const DownloadImage: React.FC<DownloadImageProps> = ({ imageUrl }) => {
  const handleDownload = async () => {
    console.log('Downloading image...');
    try {
      const response = await fetch(`/api/downloadImage?imageUrl=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InfinityMinted.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <button onClick={handleDownload}>Download Image</button>
  );
};

export default DownloadImage;
