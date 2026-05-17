import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoHideAppBar(delay = 900) {
  const [isAppBarVisible, setIsAppBarVisible] = useState(true);
  const hideAppBarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAppBarWhileScrolling = useCallback(() => {
    setIsAppBarVisible(true);

    if (hideAppBarTimer.current) {
      clearTimeout(hideAppBarTimer.current);
    }

    hideAppBarTimer.current = setTimeout(() => {
      setIsAppBarVisible(false);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (hideAppBarTimer.current) {
        clearTimeout(hideAppBarTimer.current);
      }
    };
  }, []);

  return {
    isAppBarVisible,
    showAppBarWhileScrolling,
  };
}