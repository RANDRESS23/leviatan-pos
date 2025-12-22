"use client";

import { useEffect, useRef, useTransition } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isPending]);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      ref={ref}
      shadow={true}
      height={2}
    />
  );
}
