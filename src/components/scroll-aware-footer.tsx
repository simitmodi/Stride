"use client";

import { useState, useEffect } from "react";
import Footer from "./footer";

import { usePathname } from "next/navigation";

export function ScrollAwareFooter() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hide footer on specific pages where we want a full-height app feel
  if (pathname === '/dashboard/customer/document-checklist') {
    return null;
  }

  if (pathname?.startsWith("/login")) return null;
  if (pathname?.startsWith("/signup")) return null;

  return isClient ? <Footer /> : null;
}

// Stride: Professional Financial Connectivity
