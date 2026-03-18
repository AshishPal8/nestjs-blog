"use client";

import { useEffect } from "react";
import { envConfig } from "../config/env.config";

export function KeepAlive() {
  useEffect(() => {
    fetch(`${envConfig.backendUrl}/health`).catch(() => {});

    const interval = setInterval(
      () => {
        fetch(`${envConfig.backendUrl}/health`).catch(() => {});
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
