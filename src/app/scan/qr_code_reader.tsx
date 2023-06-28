"use client";

import { useRef } from "react";

interface QrCodeProps {
  onData: (data: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QrCodeReader({ onData }: QrCodeProps) {
  const video = useRef<HTMLVideoElement>(null);

  return <video className="w-full h-full" ref={video} />;
}
