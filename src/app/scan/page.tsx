"use client";

import { useCallback, useState } from "react";
import QrCodeReader from "./qr_code_reader";

export default function Scan() {
  const [data, setData] = useState<{} | Error | null>(null);
  const onData = useCallback((data: string) => {
    try {
      const json = JSON.parse(data);
      // TODO: validate(json)
      setData(data);
      return json;
    } catch (e: any) {
      if (!(e instanceof Error)) e = new Error(e);
      setData(e);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QrCodeReader onData={onData} />
    </main>
  );
}
