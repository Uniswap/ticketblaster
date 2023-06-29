'use client'

import { useCallback } from 'react'
import styles from '../styles/Index.module.scss'

export default function Reset() {
  const reset = useCallback(() => fetch('/used', { method: 'DELETE' }), [])

  return (
    <button
      className={[styles.button, styles.footer].join(' ')}
      onClick={reset}
    >
      ;DROP TABLE tickets;--
    </button>
  )
}
