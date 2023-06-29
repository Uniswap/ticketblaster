'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import QrCodeReader from './qr_code_reader'
import styles from './scan.module.scss'

export default function Scan() {
  const [data, setData] = useState<boolean | null>(null)
  const onQRCodeParsed = (data: string) =>
    fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
      .then((res) => setData(res.ok))
      .catch(() => setData(false))

  const clearData = useCallback(() => setData(null), [])

  useEffect(() => {
    if (data) {
      setTimeout(clearData, 5 * 1000)
    }
  }, [data])

  const scanHoleClasses = useMemo(() => {
    const classes = [styles.scannerHole, styles.targetBorder]
    if (data) {
      scanHoleClasses.push(styles.success)
    }
    return classes
  }, [])

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Scan Ticket</h1>
      <QrCodeReader onData={onQRCodeParsed} onError={console.warn} />
      <div className={styles.scannerOverlay}>
        <div className={scanHoleClasses.join(' ')} />
      </div>
      <div className={styles.metadata}>
        {data === null && <p>Scan a ticket to validate it</p>}
        {data === true && <p onClick={clearData}>Valid ticket</p>}
        {data === false && <p onClick={clearData}>Invalid ticket</p>}
      </div>
    </main>
  )
}
