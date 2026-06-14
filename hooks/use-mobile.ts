import { useState, useEffect } from 'react';

export function useIsMobile(MOBILE_BREAKPOINT = 800) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [MOBILE_BREAKPOINT]);

  return isMobile;
}