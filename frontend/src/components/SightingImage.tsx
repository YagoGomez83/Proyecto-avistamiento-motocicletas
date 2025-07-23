import React from 'react';

interface SightingImageProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
}

const SightingImage: React.FC<SightingImageProps> = ({ 
  imageUrl, 
  alt = 'Imagen del avistamiento', 
  className = '',
  fallbackClassName = ''
}) => {
  const defaultImageSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im00IDhzMC00IDQtNGg4YzQgMCA0IDQgNCA0djd2M2gtMlY5aC00VjBoLTJWOUg0djdIMnYtM1Y4eiI+PC9wYXRoPjwvc3ZnPg==';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src !== defaultImageSvg) {
      console.error('Error loading image:', imageUrl);
      target.src = defaultImageSvg;
      target.className = `${className} ${fallbackClassName}`.trim();
    }
  };

  // Si no hay URL de imagen, mostramos la imagen por defecto
  const srcUrl = imageUrl || defaultImageSvg;

  return (
    <img
      src={srcUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
};

export default SightingImage;
