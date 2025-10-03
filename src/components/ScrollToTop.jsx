// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to the element that matches the hash after a small delay
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // delay to ensure element is rendered before scrolling
    } else {
      // No hash present, scroll to the top on page (route) change
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Effect runs whenever pathname or hash changes

  return null; // Component doesn't render anything
}
