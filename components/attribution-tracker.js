"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { persistAttribution } from "@/lib/analytics";

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    persistAttribution({
      pathname,
      search: searchParams.toString()
    });
  }, [pathname, searchParams]);

  return null;
}
