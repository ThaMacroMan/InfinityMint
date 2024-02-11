import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface Props {
  generatedImages: string[];
}

const GeneratedImages: React.FC<Props> = ({ generatedImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-pixel mt-5 mb-3">Generated Images:</h2>
      <div className="grid grid-cols-3 gap-4">
        {generatedImages.map((imageUrl, index) => (
          <div key={`generated-image-${index}`} onClick={() => openLightbox(index)}>
            <img src={imageUrl} alt={`Generated Image ${index + 1}`} className="cursor-pointer" />
          </div>
        ))}
      </div>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={generatedImages[lightboxIndex]}
          nextSrc={generatedImages[(lightboxIndex + 1) % generatedImages.length]}
          prevSrc={generatedImages[(lightboxIndex + generatedImages.length - 1) % generatedImages.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + generatedImages.length - 1) % generatedImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % generatedImages.length)}
        />
      )}
    </div>
  );
};

export default GeneratedImages;
