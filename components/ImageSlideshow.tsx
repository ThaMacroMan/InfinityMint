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
      }, 7000); // Change slides every 3 seconds
    }

    return () => clearInterval(slideshowInterval);
  }, [images, disabled]);

  const handleSlideshowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default action (scrolling down)
    if (toggleSlideshow) {
      toggleSlideshow();
    }
  };

  if (disabled) {
    return null; // Don't render the slideshow if it's disabled
  }

  return (
    <div>
    <div className="tag4">
    <span id="gradient-text"> Welcome to the Infinity Mint Powered by Catsky AI</span>
      <br></br>
      <p>Connect your wallet holding $CATSKY to enable AI</p>
    </div>

    <div className="slideshow-container" onClick={handleSlideshowClick}>

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
          transition: transform 5s ease; /* Apply smooth transition */
          transform: translateX(-${currentIndex * 100}%); /* Move slides horizontally */
        }
        .slide {
          flex: 0 0 auto;
          width: 100%; /* Ensure images take up full width */
          height: auto; /* Let the height adjust automatically */
          max-height: 50rem; /* Limit maximum height */
          object-fit: contain; /* Maintain aspect ratio */
        }
        .active {
          opacity: 1;
          z-index: 1;
        }
      `}</style>
      
    </div>

    <div className="tag4">
      <p>With Infinity Mint you can generate images like these</p>
      <br></br>
      <span id="gradient-text"> The more Catsky AI Assets you hold the AI features you unlock</span>

    </div>
    </div>
  );
};

export default ImageSlideshow;
