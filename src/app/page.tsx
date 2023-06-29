import Link from 'next/link'
import styles from '../styles/Index.module.scss'

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <Link className={styles.link} href="/mint">
        Mint
      </Link>
      <Link className={styles.link} href="/scan">
        Scan
      </Link>
    </main>
  )
}
