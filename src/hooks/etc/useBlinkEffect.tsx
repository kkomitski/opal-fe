import { MutableRefObject, useEffect, useRef, useState } from "react";

function useBlinkEffect(ref: MutableRefObject<any>, trigger: any) {
  const [opacity, setOpacity] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref?.current) {
      const el = ref.current as HTMLElement;

      // Clear the previous interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Instant fadeout
      el.style.opacity = "0.3";
      setOpacity(0.3);

      // Gradual fade in over 300ms
      intervalRef.current = setInterval(() => {
        setOpacity((prev) => {
          const newOpacity = prev + 0.01;
          el.style.opacity = `${newOpacity}`;

          // Clear interval when opacity reaches or exceeds 1
          if (newOpacity >= 0.9) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }

          return newOpacity;
        });
      }, 10); // 300ms / 10 steps = 30ms per step
    }

    // Clear interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [trigger]); // Run the effect when trigger changes

  return opacity;
}
export default useBlinkEffect;
