import React from 'react';

interface LichiMartLogoProps {
  className?: string;
  lightMode?: boolean;
}

export default function LichiMartLogo({ className = "h-10 w-auto", lightMode = false }: LichiMartLogoProps) {
  return (
    <img 
      src="https://lh3.googleusercontent.com/d/1I0e2E60vDeNVeF321JBS_vDsw90QlfUP"
      alt="LichiMart Logo"
      className={className}
      referrerPolicy="no-referrer"
      style={{ display: 'inline-block', verticalAlign: 'middle', objectFit: 'contain' }}
    />
  );
}
