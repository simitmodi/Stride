"use client";

import { useState, useEffect } from "react";
import Footer from "./footer";

export function ScrollAwareFooter() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Footer /> : null;
}
