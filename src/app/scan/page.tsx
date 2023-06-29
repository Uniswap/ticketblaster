'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import QrCodeReader from './qr_code_reader'
import styles from './scan.module.scss'

const enum Status {
  Ready = 'ready',
  Pending = 'pending',
  Valid = 'valid',
  Invalid = 'invalid',
  Error = 'error',
}

export default function Scan() {
  const [data, setData] = useState<string>()
  const [status, setStatus] = useState<Status>(Status.Ready)
  const [error, setError] = useState<string>()
  const resetStatus = useCallback(() => {
    setData(undefined)
    setStatus(Status.Ready)
    setError(undefined)
  }, [])

  useEffect(() => {
    let handle: NodeJS.Timeout
    if (data) {
      try {
        const json = JSON.parse(data)
        console.log('QR code data:', json)
        const { signature, owner, collectionAddress, tokenId } = json

        setStatus(Status.Pending)
        fetch(`/validate`, {
          method: 'POST',
          body: JSON.stringify({
            signature,
            owner,
            address: collectionAddress,
            id: tokenId,
          }),
        })
          .then(async (res) => {
            setStatus(res.ok ? Status.Valid : Status.Invalid)
            const json = await res.json()
            if (json?.reason) setError(json.reason)
          })
          .catch(() => setStatus(Status.Error))
          .finally(() => {
            handle = setTimeout(resetStatus, 5000)
          })
      } catch (error) {
        console.warn('Invalid QR code:', error)
      }
    }

    return () => clearTimeout(handle)
  }, [data, resetStatus])

  const heading = useMemo(() => {
    switch (status) {
      case Status.Ready:
        return 'Scan Ticket'
      case Status.Pending:
        return 'Validating'
      case Status.Valid:
        return 'Valid Ticket'
      case Status.Invalid:
        return 'Invalid Ticket'
      case Status.Error:
        return 'Error'
    }
  }, [status])

  return (
    <main
      className={[
        styles.wrapper,
        status === Status.Valid
          ? styles.success
          : [Status.Error, Status.Invalid].includes(status)
          ? styles.fail
          : '',
      ].join(' ')}
    >
      <QrCodeReader onData={setData} onError={console.warn} />

      <h1 className={styles.title}>{heading}</h1>
      {error && <h2 className={styles.subtitle}>{error}</h2>}
      <div
        className={[
          styles.scannerHole,
          status === Status.Valid
            ? styles.success
            : [Status.Error, Status.Invalid].includes(status)
            ? styles.fail
            : '',
        ].join(' ')}
        onClick={resetStatus}
      />
    </main>
  )
}
