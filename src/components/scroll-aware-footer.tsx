
"use client";

import { useState, useEffect } from "react";
import Footer from "./footer";
import { usePathname } from "next/navigation";

export function ScrollAwareFooter() {
  const [isVisible, setIsVisible] = useState(true); // Default to true
  const pathname = usePathname();

  // The footer should always be visible, so the effect is no longer needed
  // for visibility toggling. We can keep it if other path-dependent logic
  // is needed in the future, but for now it's simplified.
  useEffect(() => {
    // This effect can be used for path-dependent logic if necessary
  }, [pathname]);

  return (
    <Footer
      className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
