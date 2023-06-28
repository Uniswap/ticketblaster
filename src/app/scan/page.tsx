'use client'

import { useCallback, useEffect, useState } from 'react'
import QrCodeReader from './qr_code_reader'

export default function Scan() {
  const [data, setData] = useState<{} | Error | null>(null)
  const onData = useCallback((data: string) => {
    try {
      /* TODO:
       * const json = JSON.parse(data)
       * validate(json)
       * setData(json)
       */
      setData(data)
    } catch (e: any) {
      setData(e)
    }
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QrCodeReader onData={onData} onError={console.warn} />
    </main>
  )
}
