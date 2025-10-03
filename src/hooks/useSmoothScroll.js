// src/hooks/useSmoothScroll.js
import { useEffect } from "react";

export default function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.currentTarget.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    links.forEach((link) => link.addEventListener("click", handleClick));
    return () => links.forEach((link) => link.removeEventListener("click", handleClick));
  }, []);
}
