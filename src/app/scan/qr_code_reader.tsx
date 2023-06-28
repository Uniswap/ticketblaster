"use client";

import { useRef } from "react";

interface QrCodeProps {
  onData: (data: string) => void;
}

export default function QrCodeReader({ onData }: QrCodeProps) {
  const video = useRef<HTMLVideoElement>(null);

  return <video className="w-full h-full" ref={video} />;
}
