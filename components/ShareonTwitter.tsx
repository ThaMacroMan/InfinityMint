// components/ShareOnTwitter.tsx
import React from 'react';

interface ShareOnTwitterProps {
  url: string;
  title: string;
  imageUrl: string;
}

const ShareOnTwitter: React.FC<ShareOnTwitterProps> = ({ url, title, imageUrl }) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=infinitymint&via=your_twitter_handle&media=${encodeURIComponent(imageUrl)}`;

  return (
    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
      <img 
        src="https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg" 
        alt="Share on Twitter" 
        style={{ width: 32, height: 32 }}
      />
    </a>
  );
};

export default ShareOnTwitter;
