"use client";

import { useState, useEffect } from "react";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export function ScrollAwareFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // Always show footer
      setIsVisible(true);
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
