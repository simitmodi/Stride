"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "./footer";

export function ScrollAwareFooter() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Hide footer on specific pages where we want a full-height app feel
  const excludedPaths = [
    '/dashboard/customer/document-checklist',
    '/dashboard/customer/appointment-scheduling'
  ];

  if (excludedPaths.includes(pathname) || pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null;
  }

  return <Footer />;
}

// Stride: Professional Financial Connectivity
