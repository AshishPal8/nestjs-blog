"use client";

import { useEffect } from "react";
import { envConfig } from "../config/env.config";

export function KeepAlive() {
  useEffect(() => {
    // ping immediately on first visit
    fetch(`${envConfig.apiUrl}/health`).catch(() => {});

    // then every 10 minutes
    const interval = setInterval(
      () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`).catch(() => {});
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
