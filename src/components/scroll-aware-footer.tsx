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
  if (pathname === '/dashboard/customer/document-checklist') return null;
  if (pathname?.startsWith("/login")) return null;
  if (pathname?.startsWith("/signup")) return null;

  return isClient ? <Footer /> : null;
}

// Stride: Professional Financial Connectivity
