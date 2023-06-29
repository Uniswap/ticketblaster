'use client'

import { useCallback, useEffect, useState } from 'react'
import QrCodeReader from './qr_code_reader'
import styles from './scan.module.scss'

export default function Scan() {
  const [data, setData] = useState<unknown | Error | null>(null)
  const onData = useCallback((data: string) => {
    try {
      /* TODO:
       * const json = JSON.parse(data)
       * validate(json)
       * setData(json)
       */
      setData(data)
    } catch (e: unknown) {
      setData(e)
    }
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  const scanHoleClasses = [styles.scannerHole, styles.targetBorder]

  if (data) {
    scanHoleClasses.push(styles.success)
  }

  return (
    <main className={styles.wrapper}>
      <QrCodeReader onData={onData} onError={console.warn} />
      <div className={styles.scannerOverlay}>
        <div className={scanHoleClasses.join(' ')} />
      </div>
    </main>
  )
}
