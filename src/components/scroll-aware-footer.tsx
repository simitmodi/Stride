"use client";

import { useState, useEffect } from "react";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export function ScrollAwareFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // For dashboard, always show footer
      if (pathname.startsWith('/dashboard')) {
        setIsVisible(true);
        return;
      }
      
      // For other pages, show when scrolled to bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Initial check
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [pathname]);

  return (
    <Footer
      className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
