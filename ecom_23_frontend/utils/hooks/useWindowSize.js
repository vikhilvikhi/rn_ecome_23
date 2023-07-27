import { useEffect, useState } from "react";

const mobWidth = 1150;

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 500,
    height: 500,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return {
    windowSize,
    isMobile: typeof windowSize.width === "number" && windowSize.width < mobWidth,
    isDesktop: typeof windowSize.width === "number" && windowSize.width >= mobWidth,
  };
}