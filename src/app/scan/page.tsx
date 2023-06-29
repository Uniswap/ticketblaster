'use client'

import { useCallback, useEffect, useState } from 'react'
import QrCodeReader from './qr_code_reader'
import styles from './scan.module.scss'

const enum Status {
  Unknown = 'unknown',
  Valid = 'valid',
  Invalid = 'invalid',
  Error = 'error',
}

export default function Scan() {
  const [data, setData] = useState<string>()
  const [status, setStatus] = useState<Status>(Status.Unknown)
  const resetStatus = useCallback(() => setStatus(Status.Unknown), [])

  useEffect(() => {
    if (data) {
      try {
        const json = JSON.parse(data)
        /* TODO
         * const { signature, ticket } = json
         * const { address, id } = ticket
         */
        const signature = json // because I have a test signature
        const address = '0x01234'
        const id = 42
        fetch(`/validate/${address}/${id}`, {
          method: 'POST',
          body: JSON.stringify(signature),
        })
          .then((res) => setStatus(res.ok ? Status.Valid : Status.Invalid))
          .catch(() => setStatus(Status.Error))
      } catch (error) {
        console.warn('Invalid QR code:', error)
        return
      }
    }
  }, [data])

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Scan Ticket</h1>
      <div className={styles.scannerOverlay}>
        <QrCodeReader onData={setData} onError={console.warn} />
        <div
          className={[
            styles.scannerHole,
            styles.targetBorder,
            status === Status.Valid ? styles.success : '',
          ].join(' ')}
        />
      </div>
      <div className={styles.metadata}>
        {status === Status.Unknown && <p>Scan a ticket to validate it</p>}
        {status === Status.Valid && <p onClick={resetStatus}>Valid ticket</p>}
        {status === Status.Invalid && (
          <p onClick={resetStatus}>Invalid ticket</p>
        )}
        {status === Status.Error && <p onClick={resetStatus}>Error</p>}
      </div>
    </main>
  )
}
