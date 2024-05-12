import React, { useState, useEffect } from 'react';
import { StaticImageData } from 'next/image';
import { useWallet } from '@meshsdk/react';

interface ImageSlideshowProps {
  images: StaticImageData[];
  disabled: boolean;
  toggleSlideshow?: () => void; // Make toggleSlideshow optional
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images, disabled, toggleSlideshow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledImages, setShuffledImages] = useState<StaticImageData[]>([]);
  const [shuffled, setShuffled] = useState(false); // Track whether images have been shuffled
  const { connected } = useWallet(); 

  // Shuffle the images when the component mounts or the images change
  useEffect(() => {
    if (!shuffled) {
      const shuffled = [...images].sort(() => Math.random() - 0.5);
      setShuffledImages(shuffled);
      setShuffled(true); // Update the state to indicate images have been shuffled
    }
  }, [images, shuffled]);

  useEffect(() => {
    let slideshowInterval: NodeJS.Timeout;

    if (!disabled) {
      slideshowInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
      }, 8180); // Change slides every 8.18 seconds
    }

    return () => clearInterval(slideshowInterval);
  }, [shuffledImages, disabled]);

  if (disabled) {
    return null; // Don't render the slideshow if it's disabled
  }

  return (
    <div>
      {connected ? (
        <div className="tag5">
          {/* Content to display when wallet is connected */}
          <span id="creation-gradient-text">Enter a Prompt and click Generate Art</span>
        </div>
      ) : (
        <div className="tag5">
          {/* Content to display when wallet is not connected */}
          <span id="creation-gradient-text">Connect your Wallet</span>
        </div>
      )}

      <div className="slideshow-container">
        <div className="slides">
          {shuffledImages.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Slide ${index + 1}`}
              className={index === currentIndex ? 'slide active' : 'slide'}
            />
          ))}
        </div>
        <style jsx>{`
          .slideshow-container {
            position: relative;
            height: auto; /* Adjust height automatically */
            overflow: hidden; /* Hide overflow */
            display: flex;
            align-items: center; /* Center items vertically */
          }
          .slides {
            display: flex;
            transition: transform 6.18s ease; /* Apply smooth transition */
            transform: translateX(-${currentIndex * 100}%); /* Move slides horizontally */
          }
          .slide {
            flex: 0 0 auto;
            width: 100%; /* Ensure images take up full width */
            height: auto; /* Let the height adjust automatically */
            max-height: 40rem; /* Limit maximum height */
            object-fit: contain; /* Maintain aspect ratio */
          }
          .active {
            opacity: 1;
            z-index: 1;
          }
        `}</style>
      </div>

      {connected ? (
        <div className="tag5">
          {/* Content to display when wallet is connected */}
          <span id="creation-gradient-text">Generate images and mint them on the Cardano Blockchain</span>
          <span id="creation-gradient-text">Hold Cardania NFTs for more features...</span>
        </div>
      ) : (
        <div className="tag5">
          {/* Content to display when wallet is not connected */}
          <span id="creation-gradient-text">Forge your dreams...</span>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
