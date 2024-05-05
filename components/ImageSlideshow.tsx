import React, { useState, useEffect } from 'react';
import { StaticImageData } from 'next/image';

interface ImageSlideshowProps {
  images: StaticImageData[];
  disabled: boolean;
  toggleSlideshow?: () => void; // Make toggleSlideshow optional
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images, disabled, toggleSlideshow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let slideshowInterval: NodeJS.Timeout;

    if (!disabled) {
      slideshowInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5618); // Change slides every 3 seconds
    }

    return () => clearInterval(slideshowInterval);
  }, [images, disabled]);



  if (disabled) {
    return null; // Don't render the slideshow if it's disabled
  }

  return (
    <div>
    <div className="tag4">
    <span id="gradient-text">Connect your Wallet to Start</span>

    </div>

    <div className="slideshow-container">

      <div className="slides">
        {images.map((image, index) => (
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
          transition: transform 2.618s ease; /* Apply smooth transition */
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

    <div className="tag4">
      <span id="gradient-text"> Generate images and mint them on the Cardano Blockchain</span>
      <br></br>
      <span id="gradient-text"> Hold CatNip NFTs for more features...</span>
      </div>
    </div>
  );
};

export default ImageSlideshow;
