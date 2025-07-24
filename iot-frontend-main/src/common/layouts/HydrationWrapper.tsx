import { useEffect, useState } from "react";

const HydrationWrapper = ({ children }: { children?: any }) => {
  const [hydration, setHydration] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHydration(true);
    }
  }, []);
  return hydration ? children : null;
};

HydrationWrapper.defaultProps = {
  children: null,
};

export default HydrationWrapper;
