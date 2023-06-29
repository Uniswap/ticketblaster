'use client'

import { useCallback, useEffect, useState } from 'react'
import QrCodeReader from './qr_code_reader'
import styles from './scan.module.scss'

const enum Status {
  Unknown = 'unknown',
  Pending = 'pending',
  Valid = 'valid',
  Invalid = 'invalid',
  Error = 'error',
}

export default function Scan() {
  const [data, setData] = useState<string>()
  const [status, setStatus] = useState<Status>(Status.Unknown)
  const resetStatus = useCallback(() => {
    setData(undefined)
    setStatus(Status.Unknown)
  }, [])

  useEffect(() => {
    if (data) {
      try {
        const json = JSON.parse(data)
        /* TODO
         * const { signature, owner, address, id} = json
         */
        const signature = json // because I have a test signature
        const owner = '0x74Aa01d162E6dC6A657caC857418C403D48E2D77'
        const address = '0x0366c4fe5b9475afcb8ce7d94aac3668b6db8247'
        const id = 1
        setStatus(Status.Pending)
        fetch(`/validate`, {
          method: 'POST',
          body: JSON.stringify({ signature, owner, address, id }),
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

      <QrCodeReader onData={setData} onError={console.warn} />
      <div
        className={[
          styles.scannerHole,
          status === Status.Valid
            ? styles.success
            : status === Status.Error
            ? styles.fail
            : '',
        ].join(' ')}
      />

      <div className={styles.metadata}>
        {status === Status.Unknown && <p>Scan a ticket to validate it</p>}
        {status === Status.Pending && <p>Validating ticket</p>}
        {status === Status.Valid && <p onClick={resetStatus}>Valid ticket</p>}
        {status === Status.Invalid && (
          <p onClick={resetStatus}>Invalid ticket</p>
        )}
        {status === Status.Error && <p onClick={resetStatus}>Error</p>}
      </div>
    </main>
  )
}
