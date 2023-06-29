import Link from 'next/link'
import styles from '../styles/Index.module.scss'
import { ClearDB } from './clearDB'

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <Link
        className={styles.link}
        target="_blank"
        referrerPolicy="no-referrer"
        href="https://zora.co/collect/eth:0x0366c4fe5b9475afcb8ce7d94aac3668b6db8247/1"
      >
        Mint
      </Link>
      <Link className={styles.link} href="/scan">
        Scan
      </Link>
      <ClearDB />
    </main>
  )
}
