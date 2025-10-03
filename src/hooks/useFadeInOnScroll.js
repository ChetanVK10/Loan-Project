// src/hooks/useFadeInOnScroll.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useFadeInOnScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Re-scan for fade-in elements on every route change
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);
}
