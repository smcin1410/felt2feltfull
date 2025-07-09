import React from 'react';

interface CardProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ imageUrl, children, className }: CardProps) => {
  // Base classes for the card container
  const baseClasses = 
    'relative overflow-hidden rounded-lg shadow-lg group';

  const combinedClasses = `${baseClasses} ${className || ''}`;

  return (
    <div
      className={combinedClasses}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 transition-colors" />

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;