'use client'

import { useCallback } from 'react'
import styles from '../styles/Index.module.scss'

export function ClearDB() {
  const dropTable = useCallback(() => {
    fetch('/api/clearDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }, [])

  return (
    <button className={styles.clearDBButton} onClick={dropTable}>
      ;DROP TABLE tickets;--
    </button>
  )
}
