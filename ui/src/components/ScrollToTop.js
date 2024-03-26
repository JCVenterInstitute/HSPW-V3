import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Select the .main-content div
    const content = document.querySelector(".main-content");
    if (content) {
      // Scroll the .main-content div to the top
      content.scrollTop = 0;
    }
  }, [location]); // Dependency on location ensures this effect runs on route change

  return null;
};

export default ScrollToTop;
