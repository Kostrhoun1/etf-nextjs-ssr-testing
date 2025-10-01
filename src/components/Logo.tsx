import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 56, className = "" }) => (
  <Image
    src="/logo.png"
    alt="ETF průvodce.cz logo"
    width={size}
    height={size}
    className={`inline-block align-middle ${className}`}
    style={{maxWidth: '100%', height: 'auto'}}
    priority
  />
);

export default Logo;