// DownloadImageButton.tsx

import React from 'react';

interface DownloadImageButtonProps {
  imageUrl: string;
}

const DownloadImage: React.FC<DownloadImageButtonProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    // Make a request to the API route to download the image
    fetch(`/api/downloadImage?imageUrl=${encodeURIComponent(imageUrl)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download image');
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a temporary anchor element
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = 'image.jpg';
        document.body.appendChild(anchor);

        // Trigger the download
        anchor.click();

        // Clean up
        document.body.removeChild(anchor);
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
      });
  };

  return (
    <button onClick={handleDownload}>
      Download Image
    </button>
  );
};

export default DownloadImage;
