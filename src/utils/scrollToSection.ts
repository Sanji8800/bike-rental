import type { RefObject } from 'react';

export const scrollToSection = (ref: RefObject<HTMLDivElement>, navbarRef: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 0;
    window.scrollTo({
      top: ref.current.offsetTop - navbarHeight,
      behavior: 'smooth',
    });
  }
};